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
})
