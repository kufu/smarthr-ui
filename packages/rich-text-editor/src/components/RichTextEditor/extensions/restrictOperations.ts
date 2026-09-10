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

/**
 * 「schemaには載せるが操作はさせない」ための上書き。
 *
 * addProseMirrorPlugins も外す必要がある。link の autolink は入力ルールではなく
 * appendTransaction を持つプラグインなので、これを残すと features に link が
 * 無いのに URL 入力でリンクが付いてしまう。table の columnResizing も同様に
 * mousemove ハンドラを張ってしまう。
 * 描画は addNodeView / renderHTML 側なので、プラグインを外しても表示は保たれる。
 */
const STRIPPED_OPERATIONS = {
  addKeyboardShortcuts: () => ({}),
  addInputRules: () => [],
  addPasteRules: () => [],
  addProseMirrorPlugins: () => [],
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

export const getRestrictedExtensionNames = (features: readonly RichTextFeature[]): Set<string> => {
  const isAllowed = createTypeAllowChecker(features)

  return new Set(
    [...Object.keys(FEATURE_BY_NAME), ...SHARED_LIST_NAMES].filter((name) => !isAllowed(name)),
  )
}

export const createOperationRestrictor =
  (restrictedNames: ReadonlySet<string>) =>
  (extension: AnyExtension): AnyExtension =>
    restrictedNames.has(extension.name) ? extension.extend(STRIPPED_OPERATIONS) : extension
