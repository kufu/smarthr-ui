/**
 * 色値を #rrggbb 形式の小文字 hex に正規化する。
 * - #rgb → #rrggbb（短縮形を展開）
 * - #rrggbb → そのまま小文字化
 * - rgb(r, g, b) / rgba(r, g, b, a) → #rrggbb
 * - それ以外（hsl、color()、名前色、null、空文字）→ fallback
 */
export const normalizeHex = (color: string | null | undefined, fallback: string): string => {
  if (!color) return fallback
  const trimmed = color.trim()
  const short = trimmed.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i)
  if (short) {
    return `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`.toLowerCase()
  }
  const long = trimmed.match(/^#([0-9a-f]{6})$/i)
  if (long) return `#${long[1].toLowerCase()}`
  const rgb = trimmed.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i)
  if (rgb) {
    const toHex = (n: string) =>
      Math.max(0, Math.min(255, parseInt(n, 10)))
        .toString(16)
        .padStart(2, '0')
    return `#${toHex(rgb[1])}${toHex(rgb[2])}${toHex(rgb[3])}`
  }
  return fallback
}
