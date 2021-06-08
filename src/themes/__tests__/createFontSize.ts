import { createFontSize } from '../createFontSize'
import { createSize } from '../createSize'

describe('createFontSize', () => {
  it('returns same font size theme with createSize', () => {
    const actual = createFontSize()
    const expected = createSize()

    expect(actual.SHORT).toBe(expected.font.SHORT)
    expect(actual.TALL).toBe(expected.font.TALL)
    expect(actual.GRANDE).toBe(expected.font.GRANDE)
    expect(actual.VENTI).toBe(expected.font.VENTI)
    expect(actual.pxToRem(29)).toBe(expected.pxToRem(29))
  })

  it('returns default font size when no arguments given', () => {
    const actual = createFontSize()

    expect(actual.XXS).toBe(`${6 / 9}rem`)
    expect(actual.XS).toBe(`${6 / 8}rem`)
    expect(actual.S).toBe(`${6 / 7}rem`)
    expect(actual.M).toBe(`${6 / 6}rem`)
    expect(actual.L).toBe(`${6 / 5}rem`)
    expect(actual.XL).toBe(`${6 / 4}rem`)
    expect(actual.XXL).toBe(`${6 / 3}rem`)
  })

  it('returns customized font size theme when give user font size', () => {
    const actual = createFontSize({
      htmlFontSize: 15,
      SHORT: 19,
      TALL: 23,
      GRANDE: 31,
      VENTI: 37,
    })

    expect(actual.SHORT).toBe(19)
    expect(actual.TALL).toBe(23)
    expect(actual.GRANDE).toBe(31)
    expect(actual.VENTI).toBe(37)
    expect(actual.pxToRem(41)).toBe(`${41 / 15}rem`)
  })

  it('returns customized size theme when gives baseSize', () => {
    const actual = createFontSize({ scaleFactor: 8 })

    expect(actual.XXS).toBe(`${8 / 11}rem`)
    expect(actual.XS).toBe(`${8 / 10}rem`)
    expect(actual.S).toBe(`${8 / 9}rem`)
    expect(actual.M).toBe(`${8 / 8}rem`)
    expect(actual.L).toBe(`${8 / 7}rem`)
    expect(actual.XL).toBe(`${8 / 6}rem`)
    expect(actual.XXL).toBe(`${8 / 5}rem`)
  })

  it('the value from scaleFactor wil be overridden if a deprecated abstract value is specified', () => {
    const actual = createFontSize({
      scaleFactor: 8,
      S: '1.1rem',
      M: '1.4rem',
      L: '1.8rem',
      XL: '2.4rem',
    })

    expect(actual.XXS).toBe(`${8 / 11}rem`)
    expect(actual.XS).toBe(`${8 / 10}rem`)
    expect(actual.S).toBe('1.1rem')
    expect(actual.M).toBe('1.4rem')
    expect(actual.L).toBe('1.8rem')
    expect(actual.XL).toBe('2.4rem')
    expect(actual.XXL).toBe(`${8 / 5}rem`)
  })
})
