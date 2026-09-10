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

export const isSafeImageSrc = (src: unknown): src is string =>
  typeof src === 'string' && /^https?:\/\//i.test(src)

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
    /^rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*(?:0|1|0?\.\d+)\s*\)$/i.test(color))

export const isSafeFontSize = (fontSize: unknown): fontSize is string =>
  typeof fontSize === 'string' && /^\d+(\.\d+)?px$/.test(fontSize)

export const isSafeLinkTarget = (target: unknown): target is string =>
  typeof target === 'string' && SAFE_LINK_TARGETS.has(target)

export const isSafeTextAlign = (textAlign: unknown): textAlign is string =>
  typeof textAlign === 'string' && SAFE_TEXT_ALIGNS.has(textAlign)

export const isNumericAttr = (value: unknown): value is number | string =>
  typeof value === 'number' || (typeof value === 'string' && NUMERIC_PATTERN.test(value))

export const parseNumericAttr = (value: unknown): number | undefined =>
  isNumericAttr(value) ? Number(value) : undefined
