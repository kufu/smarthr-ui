import {
  LINK_REL,
  isNumericAttr,
  isSafeCodeLanguage,
  isSafeColor,
  isSafeFontSize,
  isSafeImageSrc,
  isSafeLinkTarget,
  isSafeTextAlign,
  isSafeUrl,
  isSafeYoutubeSrc,
} from './safeAttributes'

import type { JSONContent } from '@tiptap/core'

type AttrNormalizer = (value: unknown) => unknown

/** null は拡張のデフォルトへ戻す指示になる（キー削除ではTiptapのattrs解決に乗らない） */
const nullIfUnsafe =
  (isSafe: (value: unknown) => boolean): AttrNormalizer =>
  (value) =>
    isSafe(value) ? value : null

/**
 * colwidth の各要素は table の width 宣言へ合算されるため、
 * 数値以外が混ざるとCSS宣言の追記になる。0 は Tiptap が幅未指定として扱うので許可する。
 */
const isSafeColwidth = (value: unknown): boolean =>
  Array.isArray(value) &&
  value.every((width) => typeof width === 'number' && Number.isFinite(width) && width >= 0)

/**
 * colspan/rowspan は colgroup を組み立てるループの回数になるため、
 * 0・NaN・Infinity を渡すと列が消えたり無限ループになる。
 * null では既定値へ解決されないので schema と同じ 1 に戻す。
 */
const normalizeSpan: AttrNormalizer = (value) =>
  typeof value === 'number' && Number.isInteger(value) && value >= 1 ? value : 1

const TABLE_CELL_GUARDS: Record<string, AttrNormalizer> = {
  colspan: normalizeSpan,
  rowspan: normalizeSpan,
  colwidth: nullIfUnsafe(isSafeColwidth),
  align: nullIfUnsafe(isSafeTextAlign),
  color: nullIfUnsafe(isSafeColor),
  backgroundColor: nullIfUnsafe(isSafeColor),
}

/**
 * ノード/マークの型ごとに、信頼できない属性値の正規化を対応づける。
 *
 * Tiptap拡張の renderHTML は属性を style や属性値へそのまま展開するため、
 * 直接JSONを渡された場合に `color: 'red;position:fixed'` のようなCSS宣言の追記が
 * そのまま出力される。HTML経路とReact経路の双方が描画直前にこの表を通すことで、
 * APIによってサニタイズ結果が変わる状態を防ぐ。
 *
 * href・youtube の src・lineHeight は拡張側の renderHTML でも落ちるが、
 * 拡張の実装変更に依存しないよう明示的に検証する。
 */
const ATTR_GUARDS: Record<string, Record<string, AttrNormalizer>> = {
  // ノード
  image: {
    src: nullIfUnsafe(isSafeImageSrc),
    width: nullIfUnsafe(isNumericAttr),
    height: nullIfUnsafe(isNumericAttr),
  },
  youtube: { src: nullIfUnsafe(isSafeYoutubeSrc) },
  codeBlock: { language: nullIfUnsafe(isSafeCodeLanguage) },
  paragraph: { textAlign: nullIfUnsafe(isSafeTextAlign) },
  heading: { textAlign: nullIfUnsafe(isSafeTextAlign) },
  tableCell: TABLE_CELL_GUARDS,
  tableHeader: TABLE_CELL_GUARDS,
  // マーク
  link: {
    href: nullIfUnsafe(isSafeUrl),
    target: nullIfUnsafe(isSafeLinkTarget),
    // null だと属性ごと落ちて既定値に戻らない
    rel: () => LINK_REL,
    class: () => null,
    title: nullIfUnsafe((value) => typeof value === 'string'),
  },
  textStyle: {
    color: nullIfUnsafe(isSafeColor),
    backgroundColor: nullIfUnsafe(isSafeColor),
    fontSize: nullIfUnsafe(isSafeFontSize),
  },
}

const sanitizeAttrs = (
  type: string | undefined,
  attrs: Record<string, unknown>,
): Record<string, unknown> => {
  const guards = type ? ATTR_GUARDS[type] : undefined

  if (!guards) return attrs

  return Object.entries(guards).reduce((acc, [key, normalize]) => {
    // 属性が無い場合は schema の既定値に任せる
    if (!(key in acc)) return acc

    const sanitized = normalize(acc[key])

    return sanitized === acc[key] ? acc : { ...acc, [key]: sanitized }
  }, attrs)
}

export const sanitizeRichTextJSON = (node: JSONContent): JSONContent => ({
  ...node,
  ...(node.attrs ? { attrs: sanitizeAttrs(node.type, node.attrs) } : {}),
  ...(node.marks
    ? {
        marks: node.marks.map((mark) =>
          mark.attrs ? { ...mark, attrs: sanitizeAttrs(mark.type, mark.attrs) } : mark,
        ),
      }
    : {}),
  ...(node.content ? { content: node.content.map(sanitizeRichTextJSON) } : {}),
})
