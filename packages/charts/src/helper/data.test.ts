import { describe, expect, it, vi } from 'vitest'

import { CHART_COLORS, OTHER_CHART_COLOR, SINGLE_CHART_COLORS } from './constants'
import { getChartColors, getProgressDoughnutColors } from './data'

// Mock patternomaly's draw function since jsdom doesn't support Canvas
vi.mock('@smarthr/patternomaly', () => ({
  draw: vi.fn(
    (shapeType: string, backgroundColor: string) =>
      // Return a mock CanvasPattern object
      ({ type: 'pattern', shapeType, backgroundColor }) as unknown as CanvasPattern,
  ),
}))

describe('getProgressDoughnutColors', () => {
  it('指定toneの進捗色とグレートラックを返す', () => {
    const result = getProgressDoughnutColors(1)
    expect(result.progress).toBe(SINGLE_CHART_COLORS[1])
    expect(result.track).toBe(OTHER_CHART_COLOR)
  })

  it('tone範囲外は末尾/先頭にクランプする', () => {
    expect(getProgressDoughnutColors(99).progress).toBe(
      SINGLE_CHART_COLORS[SINGLE_CHART_COLORS.length - 1],
    )
    expect(getProgressDoughnutColors(-1).progress).toBe(SINGLE_CHART_COLORS[1])
  })

  it('最も淡い色(index 0)はdisabledに見えるため選べない', () => {
    expect(getProgressDoughnutColors(0).progress).toBe(SINGLE_CHART_COLORS[1])
  })

  it('hover色は1段濃い色を返す', () => {
    expect(getProgressDoughnutColors(1).progressHover).toBe(SINGLE_CHART_COLORS[2])
  })

  it('最濃色のときhover色は同色になる', () => {
    const last = SINGLE_CHART_COLORS.length - 1
    expect(getProgressDoughnutColors(last).progressHover).toBe(SINGLE_CHART_COLORS[last])
  })
})

describe('getChartColors', () => {
  it('系列のindex順に色を割り当てる', () => {
    const result = getChartColors(3, { disablePatterns: true })
    expect(result.map((color) => color.borderColor)).toStrictEqual([
      CHART_COLORS[0],
      CHART_COLORS[1],
      CHART_COLORS[2],
    ])
  })

  it('singleToneのときは既定でパレットの全段を使う', () => {
    const result = getChartColors(2, { disablePatterns: true, singleTone: true })
    expect(result.map((color) => color.borderColor)).toStrictEqual([
      SINGLE_CHART_COLORS[0],
      SINGLE_CHART_COLORS[SINGLE_CHART_COLORS.length - 1],
    ])
  })

  it('toneFromからtoneToの範囲に濃淡を均等配分する', () => {
    const result = getChartColors(3, {
      disablePatterns: true,
      singleTone: true,
      toneFrom: 0,
      toneTo: 4,
    })
    expect(result.map((color) => color.borderColor)).toStrictEqual([
      SINGLE_CHART_COLORS[0],
      SINGLE_CHART_COLORS[2],
      SINGLE_CHART_COLORS[4],
    ])
  })

  it('範囲を狭めれば濃淡差を抑えられる', () => {
    const result = getChartColors(3, {
      disablePatterns: true,
      singleTone: true,
      toneFrom: 0,
      toneTo: 2,
    })
    expect(result.map((color) => color.borderColor)).toStrictEqual([
      SINGLE_CHART_COLORS[0],
      SINGLE_CHART_COLORS[1],
      SINGLE_CHART_COLORS[2],
    ])
  })

  it('toneFromがtoneToより大きいときは第一系列が最も濃くなる', () => {
    const result = getChartColors(3, {
      disablePatterns: true,
      singleTone: true,
      toneFrom: 5,
      toneTo: 0,
    })
    expect(result.map((color) => color.borderColor)).toStrictEqual([
      SINGLE_CHART_COLORS[5],
      SINGLE_CHART_COLORS[3],
      SINGLE_CHART_COLORS[0],
    ])
  })

  it('系列が1つのときは濃い側の端を使い、系列数によらず色が変わらない', () => {
    const options = { disablePatterns: true, singleTone: true, toneFrom: 0, toneTo: 5 } as const
    expect(getChartColors(1, options)[0].borderColor).toBe(SINGLE_CHART_COLORS[5])
    // 向きが逆でも「濃い側の端」は変わらない
    expect(getChartColors(1, { ...options, toneFrom: 5, toneTo: 0 })[0].borderColor).toBe(
      SINGLE_CHART_COLORS[5],
    )
  })

  it('singleToneでないときはtoneFrom / toneToを無視する', () => {
    const result = getChartColors(2, { disablePatterns: true, toneFrom: 5, toneTo: 0 })
    expect(result.map((color) => color.borderColor)).toStrictEqual([
      CHART_COLORS[0],
      CHART_COLORS[1],
    ])
  })

  it('柄は第一系列以外に付く', () => {
    const result = getChartColors(2, { singleTone: true })
    expect(result[0].backgroundColor).toBe(SINGLE_CHART_COLORS[0])
    expect(result[1].backgroundColor).toMatchObject({
      type: 'pattern',
      backgroundColor: SINGLE_CHART_COLORS[SINGLE_CHART_COLORS.length - 1],
    })
  })
})
