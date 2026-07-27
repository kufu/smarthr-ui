import { describe, expect, it } from 'vitest'

import { calcHeightFromWidth, calcWidthFromHeight } from './aspectRatio'

describe('aspectRatio', () => {
  // 自然サイズ 800x600 (比率 4:3)
  describe('calcHeightFromWidth', () => {
    it('幅から高さを比率で算出する', () => {
      expect(calcHeightFromWidth(400, 800, 600)).toBe(300)
    })
    it('端数は四捨五入する', () => {
      expect(calcHeightFromWidth(438, 800, 600)).toBe(329) // 438*600/800 = 328.5 → 329
    })
    it('自然サイズが不正(0)なら undefined', () => {
      expect(calcHeightFromWidth(400, 0, 600)).toBeUndefined()
      expect(calcHeightFromWidth(400, 800, 0)).toBeUndefined()
    })
    it('幅が不正(0以下/NaN)なら undefined', () => {
      expect(calcHeightFromWidth(0, 800, 600)).toBeUndefined()
      expect(calcHeightFromWidth(NaN, 800, 600)).toBeUndefined()
    })
  })

  describe('calcWidthFromHeight', () => {
    it('高さから幅を比率で算出する', () => {
      expect(calcWidthFromHeight(300, 800, 600)).toBe(400)
    })
    it('自然サイズが不正(0)なら undefined', () => {
      expect(calcWidthFromHeight(300, 800, 0)).toBeUndefined()
    })
    it('高さが不正なら undefined', () => {
      expect(calcWidthFromHeight(-5, 800, 600)).toBeUndefined()
    })
  })
})
