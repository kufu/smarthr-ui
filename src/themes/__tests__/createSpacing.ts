import { createSpacing, createSpacingByChar, defaultBaseSize } from '../createSpacing'

const toPx = (size: number) => `${size}px`

describe('createSpacingByChar', () => {
  it('returns default spacing size when no arguments given', () => {
    const actual = createSpacingByChar()

    expect(actual(0.25)).toBe(toPx(defaultBaseSize / 2))
    expect(actual(0.5)).toBe(toPx(defaultBaseSize))
    expect(actual(0.75)).toBe(toPx(defaultBaseSize * 1.5))
    expect(actual(1)).toBe(toPx(defaultBaseSize * 2))
    expect(actual(1.25)).toBe(toPx(defaultBaseSize * 2.5))
    expect(actual(1.5)).toBe(toPx(defaultBaseSize * 3))
    expect(actual(2)).toBe(toPx(defaultBaseSize * 4))
    expect(actual(2.5)).toBe(toPx(defaultBaseSize * 5))
    expect(actual(3)).toBe(toPx(defaultBaseSize * 6))
    expect(actual(3.5)).toBe(toPx(defaultBaseSize * 7))
    expect(actual(4)).toBe(toPx(defaultBaseSize * 8))
    expect(actual(8)).toBe(toPx(defaultBaseSize * 16))
    expect(actual(-0.25)).toBe(toPx(defaultBaseSize / -2))
    expect(actual(-0.5)).toBe(toPx(defaultBaseSize * -1))
    expect(actual(-0.75)).toBe(toPx(defaultBaseSize * -1.5))
    expect(actual(-1)).toBe(toPx(defaultBaseSize * -2))
    expect(actual(-1.25)).toBe(toPx(defaultBaseSize * -2.5))
    expect(actual(-1.5)).toBe(toPx(defaultBaseSize * -3))
    expect(actual(-2)).toBe(toPx(defaultBaseSize * -4))
    expect(actual(-2.5)).toBe(toPx(defaultBaseSize * -5))
    expect(actual(-3)).toBe(toPx(defaultBaseSize * -6))
    expect(actual(-3.5)).toBe(toPx(defaultBaseSize * -7))
    expect(actual(-4)).toBe(toPx(defaultBaseSize * -8))
    expect(actual(-8)).toBe(toPx(defaultBaseSize * -16))
  })

  it('returns customized size theme when gives baseSize', () => {
    const baseSize = 13
    const actual = createSpacingByChar(baseSize)

    expect(actual(0.25)).toBe(toPx(baseSize / 2))
    expect(actual(0.5)).toBe(toPx(baseSize))
    expect(actual(0.75)).toBe(toPx(baseSize * 1.5))
    expect(actual(1)).toBe(toPx(baseSize * 2))
    expect(actual(1.25)).toBe(toPx(baseSize * 2.5))
    expect(actual(1.5)).toBe(toPx(baseSize * 3))
    expect(actual(2)).toBe(toPx(baseSize * 4))
    expect(actual(2.5)).toBe(toPx(baseSize * 5))
    expect(actual(3)).toBe(toPx(baseSize * 6))
    expect(actual(3.5)).toBe(toPx(baseSize * 7))
    expect(actual(4)).toBe(toPx(baseSize * 8))
    expect(actual(8)).toBe(toPx(baseSize * 16))
    expect(actual(-0.25)).toBe(toPx(baseSize / -2))
    expect(actual(-0.5)).toBe(toPx(baseSize * -1))
    expect(actual(-0.75)).toBe(toPx(baseSize * -1.5))
    expect(actual(-1)).toBe(toPx(baseSize * -2))
    expect(actual(-1.25)).toBe(toPx(baseSize * -2.5))
    expect(actual(-1.5)).toBe(toPx(baseSize * -3))
    expect(actual(-2)).toBe(toPx(baseSize * -4))
    expect(actual(-2.5)).toBe(toPx(baseSize * -5))
    expect(actual(-3)).toBe(toPx(baseSize * -6))
    expect(actual(-3.5)).toBe(toPx(baseSize * -7))
    expect(actual(-4)).toBe(toPx(baseSize * -8))
    expect(actual(-8)).toBe(toPx(baseSize * -16))
  })
})

describe('createSpacing', () => {
  it('returns default spacing theme when no arguments given', () => {
    const actual = createSpacing()

    expect(actual.X3S).toBe(toPx(8 / 2))
    expect(actual.XXS).toBe(toPx(8))
    expect(actual.XS).toBe(toPx(8 * 2))
    expect(actual.S).toBe(toPx(8 * 3))
    expect(actual.M).toBe(toPx(8 * 4))
    expect(actual.L).toBe(toPx(8 * 5))
    expect(actual.XL).toBe(toPx(8 * 6))
    expect(actual.XXL).toBe(toPx(8 * 7))
    expect(actual.X3L).toBe(toPx(8 * 8))
  })

  it('returns customized spacing theme when gives base size', () => {
    const actual = createSpacing(13)

    expect(actual.X3S).toBe(toPx(13 / 2))
    expect(actual.XXS).toBe(toPx(13))
    expect(actual.XS).toBe(toPx(13 * 2))
    expect(actual.S).toBe(toPx(13 * 3))
    expect(actual.M).toBe(toPx(13 * 4))
    expect(actual.L).toBe(toPx(13 * 5))
    expect(actual.XL).toBe(toPx(13 * 6))
    expect(actual.XXL).toBe(toPx(13 * 7))
    expect(actual.X3L).toBe(toPx(13 * 8))
  })

  it('returns the same value as createSpacingByChar', () => {
    const baseSize = 20
    const actual = createSpacing(baseSize)
    const expected = createSpacingByChar(baseSize)

    expect(actual.X3S).toEqual(expected(0.25))
    expect(actual.XXS).toEqual(expected(0.5))
    expect(actual.XS).toEqual(expected(1))
    expect(actual.S).toEqual(expected(1.5))
    expect(actual.M).toEqual(expected(2))
    expect(actual.L).toEqual(expected(2.5))
    expect(actual.XL).toEqual(expected(3))
    expect(actual.XXL).toEqual(expected(3.5))
    expect(actual.X3L).toEqual(expected(4))
  })
})
