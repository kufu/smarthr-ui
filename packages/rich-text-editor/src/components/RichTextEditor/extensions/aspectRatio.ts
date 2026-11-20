/**
 * 画像・YouTube の比率（画像は naturalWidth / naturalHeight）を保ったまま、
 * 幅から高さ・高さから幅を算出する純粋関数群と、その入力が正の数かの判定。
 * 算出する関数は、入力が不正（0以下・NaN・Infinity）の場合に undefined を返す。
 */

export const isPositiveNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0

export const calcHeightFromWidth = (
  width: number,
  naturalWidth: number,
  naturalHeight: number,
): number | undefined => {
  if (
    !isPositiveNumber(width) ||
    !isPositiveNumber(naturalWidth) ||
    !isPositiveNumber(naturalHeight)
  ) {
    return undefined
  }
  return Math.round((width * naturalHeight) / naturalWidth)
}

export const calcWidthFromHeight = (
  height: number,
  naturalWidth: number,
  naturalHeight: number,
): number | undefined => {
  if (
    !isPositiveNumber(height) ||
    !isPositiveNumber(naturalWidth) ||
    !isPositiveNumber(naturalHeight)
  ) {
    return undefined
  }
  return Math.round((height * naturalWidth) / naturalHeight)
}
