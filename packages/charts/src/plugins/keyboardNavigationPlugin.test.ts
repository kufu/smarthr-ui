import { describe, expect, it, vi } from 'vitest'

import { resolveLiveRegionText } from './keyboardNavigationPlugin'

describe('resolveLiveRegionText', () => {
  describe('formatが未指定の場合', () => {
    it('半角スペースで連結する', () => {
      expect(resolveLiveRegionText({ datasetLabel: '正社員', label: '4月', value: '12' })).toBe(
        '正社員 4月 12',
      )
    })

    it('空の要素を除いて連結する', () => {
      expect(resolveLiveRegionText({ datasetLabel: '', label: '4月', value: '12' })).toBe('4月 12')
      expect(resolveLiveRegionText({ datasetLabel: '', label: '', value: '12' })).toBe('12')
    })

    it('値が0でも除外しない', () => {
      expect(resolveLiveRegionText({ datasetLabel: '正社員', label: '4月', value: '0' })).toBe(
        '正社員 4月 0',
      )
    })
  })

  describe('formatが指定された場合', () => {
    it('formatの結果を返す', () => {
      const format = vi.fn(() => 'Full-time employee April 12')

      expect(
        resolveLiveRegionText({ datasetLabel: '正社員', label: '4月', value: '12' }, format),
      ).toBe('Full-time employee April 12')
      expect(format).toHaveBeenCalledWith({ datasetLabel: '正社員', label: '4月', value: '12' })
    })
  })
})
