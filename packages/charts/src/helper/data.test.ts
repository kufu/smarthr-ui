import { describe, expect, it, vi } from 'vitest'

import { OTHER_CHART_COLOR, SINGLE_CHART_COLORS } from './constants'
import { getProgressDoughnutColors } from './data'

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
    expect(getProgressDoughnutColors(-1).progress).toBe(SINGLE_CHART_COLORS[0])
  })

  it('hover色は1段濃い色を返す', () => {
    expect(getProgressDoughnutColors(1).progressHover).toBe(SINGLE_CHART_COLORS[2])
  })

  it('最濃色のときhover色は同色になる', () => {
    const last = SINGLE_CHART_COLORS.length - 1
    expect(getProgressDoughnutColors(last).progressHover).toBe(SINGLE_CHART_COLORS[last])
  })
})
