export type TableMapLike = {
  width: number
  height: number
  /**
   * width * height の配列。各スロットには、その位置を覆っているセルの開始 offset が入る。
   * セル結合がある場合、複数スロットに同じ offset が入る。
   */
  map: number[]
}

/**
 * 単一の cell offset に対応する最初の (row, col) を返す。
 * 結合セルの場合は最初に出現したスロットのみ返す（複数スロットの完全な情報が必要な場合は detectEdgeCells を使う）。
 */
export const findCellIndex = (
  map: TableMapLike,
  cellOffset: number,
): { row: number; col: number } | null => {
  const index = map.map.indexOf(cellOffset)
  if (index === -1) return null
  return {
    row: Math.floor(index / map.width),
    col: index % map.width,
  }
}

/**
 * 与えられた cell offsets のいずれかが、最右列のスロット/最下行のスロットを覆っているかを返す。
 * 結合セルにも対応するため map.map 全体を走査して判定する。
 */
export const detectEdgeCells = (
  map: TableMapLike,
  cellOffsets: number[],
): { isRightmostColumnSelected: boolean; isBottommostRowSelected: boolean } => {
  const rightmostCol = map.width - 1
  const bottommostRow = map.height - 1
  const offsetSet = new Set(cellOffsets)
  let isRightmostColumnSelected = false
  let isBottommostRowSelected = false
  for (let i = 0; i < map.map.length; i++) {
    if (!offsetSet.has(map.map[i])) continue
    const row = Math.floor(i / map.width)
    const col = i % map.width
    if (col === rightmostCol) isRightmostColumnSelected = true
    if (row === bottommostRow) isBottommostRowSelected = true
    if (isRightmostColumnSelected && isBottommostRowSelected) break
  }
  return { isRightmostColumnSelected, isBottommostRowSelected }
}
