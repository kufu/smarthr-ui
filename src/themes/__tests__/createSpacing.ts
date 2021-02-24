import { createSpacing } from '../createSpacing'
import { createSize } from '../createSize'

describe('createSpacing', () => {
  it('returns same spacing theme with createSize', () => {
    const actual = createSpacing()
    const expected = createSize()

    expect(actual.XXS).toBe(expected.space.XXS)
    expect(actual.XS).toBe(expected.space.XS)
    expect(actual.S).toBe(expected.space.S)
    expect(actual.M).toBe(expected.space.M)
    expect(actual.L).toBe(expected.space.L)
    expect(actual.XL).toBe(expected.space.XL)
    expect(actual.XXL).toBe(expected.space.XXL)
  })

  it('returns same spacing theme with createSize when give base size', () => {
    const actual = createSpacing({
      baseSize: 17,
    })
    const expected = createSize({
      space: {
        defaultRem: 17,
      },
    })

    expect(actual.XXS).toBe(expected.space.XXS)
    expect(actual.XS).toBe(expected.space.XS)
    expect(actual.S).toBe(expected.space.S)
    expect(actual.M).toBe(expected.space.M)
    expect(actual.L).toBe(expected.space.L)
    expect(actual.XL).toBe(expected.space.XL)
    expect(actual.XXL).toBe(expected.space.XXL)
  })

  it('returns customized spacing theme when give base size', () => {
    const actual = createSpacing({
      baseSize: 13,
    })

    expect(actual.XXS).toBe(13)
    expect(actual.XS).toBe(13 * 2)
    expect(actual.S).toBe(13 * 3)
    expect(actual.M).toBe(13 * 4)
    expect(actual.L).toBe(13 * 5)
    expect(actual.XL).toBe(13 * 6)
    expect(actual.XXL).toBe(13 * 7)
  })

  it('returns customized spacing theme when give base size and some tokens', () => {
    const actual = createSpacing({
      baseSize: 13,
      M: 120,
      XL: 122,
    })

    expect(actual.XXS).toBe(13)
    expect(actual.XS).toBe(13 * 2)
    expect(actual.S).toBe(13 * 3)
    expect(actual.M).toBe(120)
    expect(actual.L).toBe(13 * 5)
    expect(actual.XL).toBe(122)
    expect(actual.XXL).toBe(13 * 7)
  })
})
