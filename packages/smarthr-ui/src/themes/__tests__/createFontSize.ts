import { createFontSize } from '../createFontSize'

describe('createFontSize', () => {
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
})
