/**
 * 画像の自然サイズ（naturalWidth / naturalHeight）の比率を保ったまま、
 * 幅から高さ・高さから幅を算出する純粋関数群。
 * 入力が不正（0以下・NaN）の場合は undefined を返す。
 */

const isPositive = (n: number): boolean => Number.isFinite(n) && n > 0

export const calcHeightFromWidth = (
  width: number,
  naturalWidth: number,
  naturalHeight: number,
): number | undefined => {
  if (!isPositive(width) || !isPositive(naturalWidth) || !isPositive(naturalHeight)) {
    return undefined
  }
  return Math.round((width * naturalHeight) / naturalWidth)
}

export const calcWidthFromHeight = (
  height: number,
  naturalWidth: number,
  naturalHeight: number,
): number | undefined => {
  if (!isPositive(height) || !isPositive(naturalWidth) || !isPositive(naturalHeight)) {
    return undefined
  }
  return Math.round((height * naturalWidth) / naturalHeight)
}
