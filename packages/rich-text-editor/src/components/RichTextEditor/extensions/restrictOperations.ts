import type { RichTextFeature } from '../types'
import type { AnyExtension } from '@tiptap/core'

/**
 * extension名（= schemaのnode / mark名）→ その extension が提供する feature。
 *
 * ここに載っていない名前（doc / paragraph / text / hardBreak / undoRedo /
 * dropCursor / gapCursor / trailingNode / textStyle など）は、基盤か属性の
 * 入れ物なので常に許可する。
 */
const FEATURE_BY_NAME: Readonly<Record<string, RichTextFeature>> = {
  bold: 'bold',
  italic: 'italic',
  strike: 'strike',
  underline: 'underline',
  code: 'code',
  codeBlock: 'codeBlock',
  bulletList: 'bulletList',
  orderedList: 'orderedList',
  blockquote: 'blockquote',
  horizontalRule: 'horizontalRule',
  link: 'link',
  // schema を持たない操作専用の extension。Mod-K のショートカットを features で絞る
  linkShortcut: 'link',
  heading: 'heading',
  image: 'image',
  youtube: 'youtube',
  table: 'table',
  tableRow: 'table',
  tableHeader: 'table',
  tableCell: 'table',
  textAlign: 'textAlign',
  lineHeight: 'lineHeight',
  color: 'color',
  backgroundColor: 'backgroundColor',
  fontSize: 'fontSize',
}

/** 箇条書きと番号付きリストの共有部品。どちらのfeatureも無いときだけ制限する */
const SHARED_LIST_NAMES = ['listItem', 'listKeymap'] as const

/**
 * extension名 / schemaのnode・mark名 が features で許可されているかを判定する。
 * extensionの操作を剥がす判定（configureExtensions）と、ペーストを絞る判定
 * （pasteFilter）の両方で同じ基準を使うために共有する。
 */
export const createTypeAllowChecker =
  (features: readonly RichTextFeature[]) =>
  (name: string): boolean => {
    if ((SHARED_LIST_NAMES as readonly string[]).includes(name)) {
      return features.includes('bulletList') || features.includes('orderedList')
    }

    const feature = FEATURE_BY_NAME[name]

    return feature === undefined || features.includes(feature)
  }

/**
 * 「schemaには載せるが操作はさせない」ための上書き。
 *
 * 許可されているかの判定は呼ばれた時点で行う。生成時に決め打つと、マウント後に
 * features が変わっても操作の可否が変わらない。
 *
 * addProseMirrorPlugins も外す必要がある。link の autolink は入力ルールではなく
 * appendTransaction を持つプラグインなので、これを残すと features に link が
 * 無いのに URL 入力でリンクが付いてしまう。table の columnResizing も同様に
 * mousemove ハンドラを張ってしまう。
 * 描画は addNodeView / renderHTML 側なので、プラグインを外しても表示は保たれる。
 *
 * this を失うため arrow 関数では書けない。this.parent は extension 本来の実装を指す。
 */
export const createOperationRestrictor =
  (getFeatures: () => readonly RichTextFeature[]) =>
  (extension: AnyExtension): AnyExtension => {
    const isAllowed = () => createTypeAllowChecker(getFeatures())(extension.name)

    return extension.extend({
      addKeyboardShortcuts() {
        return isAllowed() ? (this.parent?.() ?? {}) : {}
      },
      addInputRules() {
        return isAllowed() ? (this.parent?.() ?? []) : []
      },
      addPasteRules() {
        return isAllowed() ? (this.parent?.() ?? []) : []
      },
      addProseMirrorPlugins() {
        return isAllowed() ? (this.parent?.() ?? []) : []
      },
    })
  }
