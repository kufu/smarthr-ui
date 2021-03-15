import { createRemSize, createRemSizeForPxToRem } from '../createRemSize'

describe('createRemSize', () => {
  it('returns same font size theme with createRemSize', () => {
    const actual = createRemSize()
    const expected = {
      XXS: `${6 / 9}rem`,
      XS: `${6 / 8}rem`,
      S: `${6 / 7}rem`,
      M: `${6 / 6}rem`,
      L: `${6 / 5}rem`,
      XL: `${6 / 4}rem`,
      XXL: `${6 / 3}rem`,
    }

    expect(actual.XXS).toBe(expected.XXS)
    expect(actual.XS).toBe(expected.XS)
    expect(actual.S).toBe(expected.S)
    expect(actual.M).toBe(expected.M)
    expect(actual.L).toBe(expected.L)
    expect(actual.XL).toBe(expected.XL)
    expect(actual.XXS).toBe(expected.XXS)
  })

  it('returns customized rem size theme when give user font factor', () => {
    const actual = createRemSize(8)
    const expected = {
      XXS: `${8 / 11}rem`,
      XS: `${8 / 10}rem`,
      S: `${8 / 9}rem`,
      M: `${8 / 8}rem`,
      L: `${8 / 7}rem`,
      XL: `${8 / 6}rem`,
      XXL: `${8 / 5}rem`,
    }

    expect(actual.XXS).toBe(expected.XXS)
    expect(actual.XS).toBe(expected.XS)
    expect(actual.S).toBe(expected.S)
    expect(actual.M).toBe(expected.M)
    expect(actual.L).toBe(expected.L)
    expect(actual.XL).toBe(expected.XL)
    expect(actual.XXS).toBe(expected.XXS)
  })
})

describe('createRemSizeForPxToRem', () => {
  it('returns same font size theme with createRemSizeForPxToRem', () => {
    const actual = createRemSizeForPxToRem()
    const expected = {
      XXS: 16 * (6 / 9),
      XS: 16 * (6 / 8),
      S: 16 * (6 / 7),
      M: 16 * (6 / 6),
      L: 16 * (6 / 5),
      XL: 16 * (6 / 4),
      XXL: 16 * (6 / 3),
    }

    expect(actual.XXS).toBe(expected.XXS)
    expect(actual.XS).toBe(expected.XS)
    expect(actual.S).toBe(expected.S)
    expect(actual.M).toBe(expected.M)
    expect(actual.L).toBe(expected.L)
    expect(actual.XL).toBe(expected.XL)
    expect(actual.XXS).toBe(expected.XXS)
  })
})
