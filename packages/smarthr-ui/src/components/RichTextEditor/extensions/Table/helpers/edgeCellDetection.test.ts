import { describe, expect, it } from 'vitest'

import { detectEdgeCells, findCellIndex } from './edgeCellDetection'

// 3x3 テーブルの TableMap 模倣（数値はセル開始オフセットの想定値、findCellIndex は indexOf で見るだけなので一意なら何でもOK）
const make3x3Map = () => ({
  width: 3,
  height: 3,
  map: [0, 4, 8, 12, 16, 20, 24, 28, 32],
})

describe('findCellIndex', () => {
  it('returns (0,0) for top-left cell', () => {
    expect(findCellIndex(make3x3Map(), 0)).toEqual({ row: 0, col: 0 })
  })

  it('returns (1,1) for center cell', () => {
    expect(findCellIndex(make3x3Map(), 16)).toEqual({ row: 1, col: 1 })
  })

  it('returns (2,2) for bottom-right cell', () => {
    expect(findCellIndex(make3x3Map(), 32)).toEqual({ row: 2, col: 2 })
  })

  it('returns null for unknown offset', () => {
    expect(findCellIndex(make3x3Map(), 99)).toBeNull()
  })

  it('returns the first slot for an offset that appears in multiple slots (merged cell)', () => {
    // offset 16 appears at indices 4 and 5 (col 1 and col 2 of row 1)
    const mergedMap = { width: 3, height: 3, map: [0, 4, 8, 12, 16, 16, 24, 28, 32] }
    expect(findCellIndex(mergedMap, 16)).toEqual({ row: 1, col: 1 })
  })
})

describe('detectEdgeCells', () => {
  it('returns both false for the center cell of a 3x3', () => {
    expect(detectEdgeCells(make3x3Map(), [16])).toEqual({
      isRightmostColumnSelected: false,
      isBottommostRowSelected: false,
    })
  })

  it('returns isRightmostColumnSelected for rightmost column cells', () => {
    expect(detectEdgeCells(make3x3Map(), [8])).toEqual({
      isRightmostColumnSelected: true,
      isBottommostRowSelected: false,
    })
  })

  it('returns isBottommostRowSelected for bottom row cells', () => {
    expect(detectEdgeCells(make3x3Map(), [24])).toEqual({
      isRightmostColumnSelected: false,
      isBottommostRowSelected: true,
    })
  })

  it('returns both for the bottom-right cell', () => {
    expect(detectEdgeCells(make3x3Map(), [32])).toEqual({
      isRightmostColumnSelected: true,
      isBottommostRowSelected: true,
    })
  })

  it('treats a multi-cell selection that touches the rightmost column as right-edge', () => {
    // 中央セルと最右列の中央セルを選択（CellSelection 相当）
    expect(detectEdgeCells(make3x3Map(), [16, 20])).toEqual({
      isRightmostColumnSelected: true,
      isBottommostRowSelected: false,
    })
  })

  it('treats a multi-cell selection that touches the bottom row as bottom-edge', () => {
    expect(detectEdgeCells(make3x3Map(), [16, 28])).toEqual({
      isRightmostColumnSelected: false,
      isBottommostRowSelected: true,
    })
  })

  it('returns both false for an empty selection', () => {
    expect(detectEdgeCells(make3x3Map(), [])).toEqual({
      isRightmostColumnSelected: false,
      isBottommostRowSelected: false,
    })
  })

  it('handles merged cells where one cell offset covers multiple slots including the rightmost column', () => {
    // 中央のセル(offset=16)が右隣(col=2)に colSpan=2 で広がっている想定
    // map: [0, 4, 8, 12, 16, 16, 24, 28, 32]
    const mergedMap = { width: 3, height: 3, map: [0, 4, 8, 12, 16, 16, 24, 28, 32] }
    expect(detectEdgeCells(mergedMap, [16])).toEqual({
      isRightmostColumnSelected: true,
      isBottommostRowSelected: false,
    })
  })
})
