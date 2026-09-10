import { formatNumericString } from './formatNumericString'

describe('formatNumericString', () => {
  it('adds comma to integer every 3 digits', () => {
    expect(formatNumericString('12345678.1234')).toBe('12,345,678.1234')
  })

  it('converts full-width characters to half-width', () => {
    expect(formatNumericString('ー１２３４．５')).toBe('-1,234.5')
  })

  it('does not convert if arg includes non-numeric characters', () => {
    expect(formatNumericString('12345a')).toBe('12345a')
    expect(formatNumericString('1.2.3')).toBe('1.2.3')
  })

  it('removes the 0 at the front of integer part', () => {
    expect(formatNumericString('000001234')).toBe('1,234')
    expect(formatNumericString('00.01234')).toBe('0.01234')
    expect(formatNumericString('-000001234')).toBe('-1,234')
    expect(formatNumericString('-000.0001234')).toBe('-0.0001234')
  })

  it('does not remove the 0 if integer part is 0', () => {
    expect(formatNumericString('0.1234')).toBe('0.1234')
    expect(formatNumericString('-0.1234')).toBe('-0.1234')
    expect(formatNumericString('0')).toBe('0')
  })

  it('removes the 0 at the end of decimal part', () => {
    expect(formatNumericString('12.0345000')).toBe('12.0345')
  })

  it('removes the dot if decimal part is 0', () => {
    expect(formatNumericString('12.0000')).toBe('12')
    expect(formatNumericString('0.0')).toBe('0')
  })

  it('returns blank string when arg is undefined', () => {
    expect(formatNumericString()).toBe('')
  })

  it('is idempotent', () => {
    const testCases = [
      '12345678.1234',
      'ー１２３４．５',
      '000001234',
      '0.1234',
      '12.0345000',
      '12.0000',
      '12345a',
      '1.2.3',
    ]
    testCases.forEach((testCase) => {
      const once = formatNumericString(testCase)
      const twice = formatNumericString(once)
      expect(twice).toBe(once)
    })
  })
})
