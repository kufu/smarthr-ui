type Rect = { top: number; left: number; width: number; height: number }
type Point = { x: number; y: number }

/**
 * テーブル本体 + 右側バー領域 + 下側バー領域 を内包する矩形に対する hit test。
 *
 * - `inside`: 拡張領域内かどうか（バー領域 + テーブル本体）
 * - `inRightBar`: 右バー領域内（x > tableRight、y はテーブル上端から拡張下端まで）
 * - `inBottomBar`: 下バー領域内（y > tableBottom、x はテーブル左端から拡張右端まで）
 *
 * 右下の交差ゾーン（x > tableRight && y > tableBottom）は inRightBar / inBottomBar 両方 true となる。
 * これは右バー → 下バー を斜め移動する間に bar 表示がフリッカーしないようにするための意図的な重複。
 */
export const hitTestExtendedTableArea = (
  point: Point,
  rect: Rect,
  barThickness: number,
): { inside: boolean; inRightBar: boolean; inBottomBar: boolean } => {
  const tableRight = rect.left + rect.width
  const tableBottom = rect.top + rect.height
  const extendedRight = tableRight + barThickness
  const extendedBottom = tableBottom + barThickness

  const withinExtendedX = point.x >= rect.left && point.x <= extendedRight
  const withinExtendedY = point.y >= rect.top && point.y <= extendedBottom
  const inside = withinExtendedX && withinExtendedY

  if (!inside) return { inside: false, inRightBar: false, inBottomBar: false }

  const inRightBar = point.x > tableRight
  const inBottomBar = point.y > tableBottom
  return { inside, inRightBar, inBottomBar }
}
