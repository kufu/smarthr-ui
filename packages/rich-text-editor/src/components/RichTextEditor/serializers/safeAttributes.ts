import { type HeadingLevel, SUPPORTED_HEADING_LEVELS } from '../extensions/configureHeading'

import type { MediaAlign } from '../extensions/mediaAlign'

/**
 * 外部から直接 JSON を渡された場合に信頼できない属性値のallowlist。
 *
 * HTML経路（serializeToHTML）とReact経路（serializeToReactElement）の両方が
 * 同じ判定を使うことで、APIによってサニタイズ結果が変わる状態を防ぐ。
 */

const NUMERIC_PATTERN = /^\d+(\.\d+)?$/

const SAFE_LINK_TARGETS = new Set(['_blank', '_self', '_parent', '_top'])

const SAFE_TEXT_ALIGNS = new Set(['left', 'center', 'right', 'justify'])

export const isSafeUrl = (url: unknown): url is string =>
  typeof url === 'string' && /^https?:\/\/|^mailto:/i.test(url.trim())

/**
 * アップロード API が返すことの多いルート相対パスも許可する。
 * `//host` と `/\host` はブラウザが別ホストとして解釈し、URL の解析時にタブと改行は
 * 取り除かれる（`/\t/host` は `//host` になる）ため除く。
 */
export const isSafeImageSrc = (src: unknown): src is string =>
  typeof src === 'string' &&
  (/^https?:\/\//i.test(src) || (/^\/(?![/\\])/.test(src) && !/[\t\n\r]/.test(src)))

export const isSafeYoutubeSrc = (src: unknown): src is string =>
  typeof src === 'string' &&
  /^https?:\/\/(www\.)?(youtube\.com|youtu\.be|youtube-nocookie\.com)\//i.test(src)

/**
 * style値として出力されるため、CSS宣言の追記（`red;position:fixed`）を弾く必要がある。
 * 16進数・rgb()・rgba() のみ許可する。
 */
export const isSafeColor = (color: unknown): color is string =>
  typeof color === 'string' &&
  (/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(color) ||
    /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/i.test(color) ||
    /^rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*(?:0|0?\.\d+|1(?:\.0+)?)\s*\)$/i.test(
      color,
    ))

// 入力の単位は sanitizeRichTextJSON と貼り付けで rem にそろえるため、rem だけを通す
export const isSafeFontSize = (fontSize: unknown): fontSize is string =>
  typeof fontSize === 'string' && /^\d+(\.\d+)?rem$/.test(fontSize)

/**
 * CodeBlock 拡張は `language-` 接頭辞を付けて class へ展開するため、
 * 空白を許すと任意のクラスを追加できてしまう。
 */
export const isSafeCodeLanguage = (language: unknown): language is string =>
  typeof language === 'string' && /^[a-z0-9_+.#-]+$/i.test(language)

/**
 * Link 拡張の既定値と同じ。JSON で上書きされると noopener が外れるため、
 * 入力に関わらずこの値で出力する。
 */
export const LINK_REL = 'noopener noreferrer nofollow'

export const isSafeLinkTarget = (target: unknown): target is string =>
  typeof target === 'string' && SAFE_LINK_TARGETS.has(target)

export const isSafeMediaAlign = (align: unknown): align is MediaAlign =>
  align === 'center' || align === 'right'

export const isSafeTextAlign = (textAlign: unknown): textAlign is string =>
  typeof textAlign === 'string' && SAFE_TEXT_ALIGNS.has(textAlign)

/** 寸法として style や属性へ出力されるため、NaN・Infinity・負値を除外する */
export const isNumericAttr = (value: unknown): value is number | string =>
  (typeof value === 'number' && Number.isFinite(value) && value >= 0) ||
  (typeof value === 'string' && NUMERIC_PATTERN.test(value))

export const parseNumericAttr = (value: unknown): number | undefined =>
  isNumericAttr(value) ? Number(value) : undefined

/**
 * colspan/rowspan は colgroup を組み立てるループの回数になるため、
 * 0・NaN・Infinity を渡すと列が消えたり無限ループになる。
 * null では既定値へ解決されないので schema と同じ 1 に戻す。
 */
export const normalizeSpan = (value: unknown): number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 1 ? value : 1

/**
 * colwidth の各要素は table の width 宣言へ合算されるため、
 * 数値以外が混ざるとCSS宣言の追記になる。0 は Tiptap が幅未指定として扱うので許可する。
 */
export const isSafeColwidth = (value: unknown): value is number[] =>
  Array.isArray(value) &&
  value.every((width) => typeof width === 'number' && Number.isFinite(width) && width >= 0)

/**
 * Youtube 拡張は start を埋め込みURLのクエリへ文字列連結するため、
 * 数値以外を通すとクエリの追記になる。null でも 0 と同じ扱いになるが schema の既定値に揃える。
 */
export const normalizeStart = (value: unknown): number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : 0

const MIN_HEADING_LEVEL = Math.min(...SUPPORTED_HEADING_LEVELS)
const MAX_HEADING_LEVEL = Math.max(...SUPPORTED_HEADING_LEVELS)

/**
 * HTML 経路の Tiptap は対応外のレベルを先頭のレベルへ描き替え、h5・h6 が h1 になる。
 * レベルの上下関係を保つため、範囲外の値は近い端へ寄せる。数値として読めない値だけ schema の既定値にする。
 *
 * React 経路でも sanitize 済みの値に任せずこの関数を通す。補正を別々に持つと、
 * sanitize が変わったときに経路ごとに違うレベルへ寄せてしまうため
 */
export const normalizeHeadingLevel = (value: unknown): HeadingLevel => {
  const level = typeof value === 'number' || typeof value === 'string' ? Number(value) : Number.NaN
  const clamped =
    Number.isNaN(level) || (typeof value === 'string' && value.trim() === '')
      ? MIN_HEADING_LEVEL
      : Math.min(Math.max(Math.round(level), MIN_HEADING_LEVEL), MAX_HEADING_LEVEL)

  return (
    SUPPORTED_HEADING_LEVELS.find((supported) => supported === clamped) ??
    SUPPORTED_HEADING_LEVELS[0]
  )
}
