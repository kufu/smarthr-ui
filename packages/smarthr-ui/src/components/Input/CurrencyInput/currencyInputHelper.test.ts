import { formatCurrency } from './currencyInputHelper'

describe('currencyInputHelper', () => {
  describe('formatCurrency', () => {
    it('adds comma to integer every 3 digits', () => {
      expect(formatCurrency('12345678.1234')).toBe('12,345,678.1234')
    })

    it('converts full-width characters to half-width', () => {
      expect(formatCurrency('ー１２３４．５')).toBe('-1,234.5')
    })

    it('does not convert if arg includes non-numeric characters', () => {
      expect(formatCurrency('12345a')).toBe('12345a')
      expect(formatCurrency('1.2.3')).toBe('1.2.3')
    })

    it('removes the 0 at the front of integer part', () => {
      expect(formatCurrency('000001234')).toBe('1,234')
      expect(formatCurrency('00.01234')).toBe('0.01234')
      expect(formatCurrency('-000001234')).toBe('-1,234')
      expect(formatCurrency('-000.0001234')).toBe('-0.0001234')
    })

    it('does not remove the 0 if integer part is 0', () => {
      expect(formatCurrency('0.1234')).toBe('0.1234')
      expect(formatCurrency('-0.1234')).toBe('-0.1234')
      expect(formatCurrency('0')).toBe('0')
    })

    it('removes the 0 at the end of decimal part', () => {
      expect(formatCurrency('12.0345000')).toBe('12.0345')
    })

    it('removes the dot if decimal part is 0', () => {
      expect(formatCurrency('12.0000')).toBe('12')
      expect(formatCurrency('0.0')).toBe('0')
    })

    it('returns blank string when arg is undefined', () => {
      expect(formatCurrency()).toBe('')
    })
  })
})
