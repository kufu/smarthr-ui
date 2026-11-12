import { isPositiveNumber } from '../extensions/aspectRatio'
import { normalizeFontSize } from '../extensions/normalizeFontSize'
import {
  YOUTUBE_DEFAULT_SIZE,
  calcYoutubeHeight,
  calcYoutubeWidth,
} from '../extensions/youtubeOptions'
import { normalizeYoutubeUrl } from '../extensions/youtubeUrl'

import {
  LINK_REL,
  fitWidthsToColspan,
  isNumericAttr,
  isSafeCodeLanguage,
  isSafeColor,
  isSafeColwidth,
  isSafeImageSrc,
  isSafeLinkTarget,
  isSafeMediaAlign,
  isSafeTextAlign,
  isSafeUrl,
  isSafeYoutubeSrc,
  normalizeColspan,
  normalizeHeadingLevel,
  normalizeRowspan,
  normalizeStart,
} from './safeAttributes'

import type { JSONContent } from '@tiptap/core'

type JSONMark = NonNullable<JSONContent['marks']>[number]

type AttrNormalizer = (value: unknown) => unknown

const nullIfUnsafe =
  (isSafe: (value: unknown) => boolean): AttrNormalizer =>
  (value) =>
    isSafe(value) ? value : null

const nullIfNotString = nullIfUnsafe((value) => typeof value === 'string')

// null に戻さないのは、HTML 経路が alt 属性ごと省き、React 経路の alt="" とずれるため
const emptyIfNotString: AttrNormalizer = (value) => (typeof value === 'string' ? value : '')

const normalizeYoutubeDimension =
  (fallback: number): AttrNormalizer =>
  (value) =>
    isPositiveNumber(value) ? value : fallback

// 片方だけを既定値に戻すと 320×360 のように比率が崩れるため、正しい側から 16:9 で補う
const completeYoutubeSize: AttrsNormalizer = (attrs) => {
  const hasWidth = isPositiveNumber(attrs.width)
  const hasHeight = isPositiveNumber(attrs.height)

  if (hasWidth && !hasHeight) {
    return { ...attrs, height: calcYoutubeHeight(attrs.width as number) }
  }
  if (!hasWidth && hasHeight) {
    return { ...attrs, width: calcYoutubeWidth(attrs.height as number) }
  }

  return attrs
}

const TABLE_CELL_GUARDS: Record<string, AttrNormalizer> = {
  colspan: normalizeColspan,
  rowspan: normalizeRowspan,
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
    alt: emptyIfNotString,
    title: nullIfNotString,
    width: nullIfUnsafe(isNumericAttr),
    height: nullIfUnsafe(isNumericAttr),
    align: nullIfUnsafe(isSafeMediaAlign),
  },
  youtube: {
    src: nullIfUnsafe(isSafeYoutubeSrc),
    start: normalizeStart,
    width: normalizeYoutubeDimension(YOUTUBE_DEFAULT_SIZE.width),
    height: normalizeYoutubeDimension(YOUTUBE_DEFAULT_SIZE.height),
    align: nullIfUnsafe(isSafeMediaAlign),
  },
  codeBlock: { language: nullIfUnsafe(isSafeCodeLanguage) },
  paragraph: { textAlign: nullIfUnsafe(isSafeTextAlign) },
  heading: { level: normalizeHeadingLevel, textAlign: nullIfUnsafe(isSafeTextAlign) },
  tableCell: TABLE_CELL_GUARDS,
  tableHeader: TABLE_CELL_GUARDS,
  // マーク
  link: {
    href: nullIfUnsafe(isSafeUrl),
    target: nullIfUnsafe(isSafeLinkTarget),
    // null だと属性ごと落ちて既定値に戻らない
    rel: () => LINK_REL,
    class: () => null,
    title: nullIfNotString,
  },
  textStyle: {
    color: nullIfUnsafe(isSafeColor),
    backgroundColor: nullIfUnsafe(isSafeColor),
    fontSize: normalizeFontSize,
  },
}

type AttrsNormalizer = (attrs: Record<string, unknown>) => Record<string, unknown>

/**
 * colspan より長いときに落とさず切るのは、colspan の範囲の幅はそのまま使えるため。
 * 短いときに足りない列を幅未指定の 0 で埋めるのは、短いまま残すと表を編集したときに足りない列が穴になり、
 * 保存で列幅ごと落ちるため。落とさないのは、分かっている列の幅まで消えるため
 */
const fitColwidthToColspan: AttrsNormalizer = (attrs) => {
  // 不正な値を合わせないのは、不正な要素だけが切り落とされ、残りが通ってしまうため
  if (!isSafeColwidth(attrs.colwidth)) return attrs

  return { ...attrs, colwidth: fitWidthsToColspan(attrs.colwidth, normalizeColspan(attrs.colspan)) }
}

/**
 * 複数の属性をまたいで直すもの。ATTR_GUARDS より先に適用する。
 *
 * youtube の src は出力で落ちる表記でも同じ動画を指すため、落とさず揃える。
 * embed の URL の start は揃えると src から消えるので、start 属性へ移す。
 */
const ATTRS_NORMALIZERS: Record<string, AttrsNormalizer> = {
  tableCell: fitColwidthToColspan,
  tableHeader: fitColwidthToColspan,
  youtube: (attrs) => {
    const sized = completeYoutubeSize(attrs)

    if (!('src' in sized)) return sized

    const normalized = normalizeYoutubeUrl(sized.src)

    if (!normalized) return { ...sized, src: null }

    // src の開始位置で上書きしないのは、読み込んだだけで再生位置が変わり、保存データとずれるため
    return sized.start === undefined || sized.start === null
      ? { ...sized, ...normalized }
      : { ...sized, src: normalized.src }
  },
}

export const sanitizeAttrs = (
  type: string | undefined,
  rawAttrs: Record<string, unknown>,
): Record<string, unknown> => {
  const normalizeAttrs = type ? ATTRS_NORMALIZERS[type] : undefined
  const attrs = normalizeAttrs ? normalizeAttrs(rawAttrs) : rawAttrs
  const guards = type ? ATTR_GUARDS[type] : undefined

  if (!guards) return attrs

  return Object.entries(guards).reduce((acc, [key, normalize]) => {
    // 属性が無い場合は schema の既定値に任せる
    if (!(key in acc)) return acc

    const sanitized = normalize(acc[key])

    return sanitized === acc[key] ? acc : { ...acc, [key]: sanitized }
  }, attrs)
}

/**
 * 検証した属性で残せないマークか。貼り付けと読み込みで同じ判定にするため共有する。
 *
 * href の無いリンクとして残さないのは、押しても開かないのに見た目だけがリンクになるため。
 */
export const shouldDropMark = (type: string, attrs: Record<string, unknown> | undefined) =>
  type === 'link' && (attrs?.href ?? null) === null

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isPresent = <T>(value: T | null): value is T => value !== null

const sanitizeMark = (mark: unknown): JSONMark | null => {
  if (!isRecord(mark) || typeof mark.type !== 'string') return null

  const { attrs, ...rest } = mark
  const sanitized = isRecord(attrs) ? sanitizeAttrs(mark.type, attrs) : undefined

  if (shouldDropMark(mark.type, sanitized)) return null

  return {
    ...rest,
    ...(sanitized ? { attrs: sanitized } : {}),
    type: mark.type,
  }
}

/**
 * 保存済みの JSON は別バージョンの schema で書かれたものや壊れたものもありうる。
 * 形の崩れた部分だけを取り除き、ProseMirror の Node.fromJSON が例外を投げないようにする。
 */
const sanitizeNode = (node: unknown): JSONContent | null => {
  if (!isRecord(node) || typeof node.type !== 'string') return null
  // ProseMirror は文字列を持たない text ノードも空文字の text ノードも受け付けない
  if (node.type === 'text' && (typeof node.text !== 'string' || node.text === '')) return null

  const { attrs, marks, content, ...rest } = node

  return {
    ...rest,
    ...(isRecord(attrs) ? { attrs: sanitizeAttrs(node.type, attrs) } : {}),
    ...(Array.isArray(marks) ? { marks: marks.map(sanitizeMark).filter(isPresent) } : {}),
    ...(Array.isArray(content) ? { content: content.map(sanitizeNode).filter(isPresent) } : {}),
    type: node.type,
  }
}

export const createEmptyDocument = () => ({
  type: 'doc' as const,
  content: [{ type: 'paragraph' }],
})

export const sanitizeRichTextJSON = (json: unknown): JSONContent =>
  sanitizeNode(json) ?? createEmptyDocument()
