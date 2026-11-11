import type { Editor } from '@tiptap/core'
import type { Plugin } from '@tiptap/pm/state'

/**
 * こちらが入れた plugin の一覧。registerPlugin で後から足されたものと区別するために持つ。
 *
 * plugin.key での突き合わせはできない。PluginKey を明示していない plugin には
 * ProseMirror が `plugin$3` のような連番のキーを振るため、組み直すたびに別のキーになる。
 */
const managedPlugins = new WeakMap<Editor, readonly Plugin[]>()

/**
 * 前回 NodeView を登録したノード名。addNodeView が features で変えるのは NodeView を
 * 返すかどうかだけなので、名前が同じなら作り直さなくてよい。NodeView の中身を変える場合や
 * addMarkView を使う場合（createNodeViews は markViews も設定し直す）は、名前では
 * 比べられないので見直す。
 */
const nodeViewNames = new WeakMap<Editor, string>()

// 型は Record だが、addNodeView が null を返した extension は undefined の値で入るため除く
const getNodeViewNames = (editor: Editor) =>
  Object.entries(editor.extensionManager.nodeViews)
    .filter(([, nodeView]) => nodeView !== undefined)
    .map(([name]) => name)
    .sort()
    .join(',')

/**
 * Editor 作成直後の plugin 一覧を「こちらが入れたもの」として記録する。
 *
 * Tiptap は生成時に extensionManager の plugin だけで state を組むため、この時点の
 * 一覧がそのまま管理対象になる。記録前に registerPlugin された plugin は区別できない。
 */
export const rememberManagedPlugins = (editor: Editor) => {
  managedPlugins.set(editor, editor.state.plugins)
  nodeViewNames.set(editor, getNodeViewNames(editor))
}

/**
 * features / 見出しの許可レベルの変更を、Editor と schema を保ったまま反映する。
 *
 * extensions を useEditor の依存配列へ入れて作り直す方法は採らない。本文と Undo 履歴を
 * 失うため。制限の判定は extension 側が実行時に行うので、ここでは plugin を組み直して
 * 同じ schema のまま state を差し替える。
 *
 * **Tiptap の内部 API に依存する処理はこのファイルだけに置く。**
 * `extensionManager.plugins` はアクセスのたびに全 extension の addProseMirrorPlugins /
 * addKeyboardShortcuts を評価して plugin を作り直す getter、`extensionManager.nodeViews` は
 * addNodeView を評価し直す getter、`createNodeViews()` は NodeView を作り直す。
 * いずれも公開APIとしての互換保証は無い。
 */
export const reconfigureEditorOperations = (editor: Editor) => {
  if (editor.isDestroyed) return

  const previous = managedPlugins.get(editor) ?? editor.state.plugins
  // registerPlugin で後から足された plugin は extensionManager の管理外にある。
  // 組み直した一覧で丸ごと置き換えると消えてしまうため、残しておく。
  const external = editor.state.plugins.filter((plugin) => !previous.includes(plugin))
  // props.nodeViews を持つ plugin（表の columnResizing）は、作り直すと関数の参照が変わり、
  // ProseMirror が文書全体を描き直す。設定は生成時から変わらないので、前の instance を使い続ける。
  // 突き合わせに固定の PluginKey が要るため、key の無い plugin で nodeViews を返すと描き直しが戻る
  const next = editor.extensionManager.plugins.map(
    (plugin) =>
      (plugin.props.nodeViews &&
        previous.find((prev) => prev.spec.key && prev.spec.key === plugin.spec.key)) ||
      plugin,
  )

  // schema も doc も作り直さない。PluginKey を固定している plugin の state は
  // reconfigure が引き継ぐため、Undo 履歴やアップロード中プレースホルダは保たれる。
  editor.view.updateState(editor.state.reconfigure({ plugins: [...next, ...external] }))
  managedPlugins.set(editor, next)

  // 毎回 createNodeViews しないのは、NodeView を持つノードがすべて作り直されるため。
  // 画像は読み込み済みでも一瞬消え、YouTube は iframe が差し替わって再生が止まる
  const names = getNodeViewNames(editor)
  if (names !== nodeViewNames.get(editor)) {
    nodeViewNames.set(editor, names)
    editor.createNodeViews()
  }
}
