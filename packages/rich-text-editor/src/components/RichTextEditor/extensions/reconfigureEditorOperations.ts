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
 * Editor 作成直後の plugin 一覧を「こちらが入れたもの」として記録する。
 *
 * Tiptap は生成時に extensionManager の plugin だけで state を組むため、この時点の
 * 一覧がそのまま管理対象になる。記録前に registerPlugin された plugin は区別できない。
 */
export const rememberManagedPlugins = (editor: Editor) => {
  managedPlugins.set(editor, editor.state.plugins)
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
 * addKeyboardShortcuts を評価して plugin を作り直す getter で、`createNodeViews()` は
 * NodeView を作り直す。どちらも公開APIとしての互換保証は無い。
 */
export const reconfigureEditorOperations = (editor: Editor) => {
  if (editor.isDestroyed) return

  const previous = managedPlugins.get(editor) ?? editor.state.plugins
  // registerPlugin で後から足された plugin は extensionManager の管理外にある。
  // 組み直した一覧で丸ごと置き換えると消えてしまうため、残しておく。
  const external = editor.state.plugins.filter((plugin) => !previous.includes(plugin))
  const next = editor.extensionManager.plugins

  // schema も doc も作り直さない。PluginKey を固定している plugin の state は
  // reconfigure が引き継ぐため、Undo 履歴やアップロード中プレースホルダは保たれる。
  editor.view.updateState(editor.state.reconfigure({ plugins: [...next, ...external] }))
  managedPlugins.set(editor, next)
  editor.createNodeViews()
}
