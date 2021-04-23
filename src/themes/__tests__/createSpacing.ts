import { createSpacing, createSpacingByChar } from '../createSpacing'

describe('createSpacing', () => {
  it('returns customized spacing theme when give base size', () => {
    const actual = createSpacing({
      baseSize: 13,
    })

    expect(actual.X3S).toBe(`${13 / 2}px`)
    expect(actual.XXS).toBe('13px')
    expect(actual.XS).toBe(`${13 * 2}px`)
    expect(actual.S).toBe(`${13 * 3}px`)
    expect(actual.M).toBe(`${13 * 4}px`)
    expect(actual.L).toBe(`${13 * 5}px`)
    expect(actual.XL).toBe(`${13 * 6}px`)
    expect(actual.XXL).toBe(`${13 * 7}px`)
    expect(actual.X3L).toBe(`${13 * 8}px`)
  })

  it('returns customized spacingByChar theme when give base size', () => {
    const actual = createSpacingByChar(createSpacing({ baseSize: 13 }))

    expect(actual['0.5']).toBe(`${13 / 2}px`)
    expect(actual[1]).toBe('13px')
    expect(actual[2]).toBe(`${13 * 2}px`)
    expect(actual[3]).toBe(`${13 * 3}px`)
    expect(actual[4]).toBe(`${13 * 4}px`)
    expect(actual[5]).toBe(`${13 * 5}px`)
    expect(actual[6]).toBe(`${13 * 6}px`)
    expect(actual[7]).toBe(`${13 * 7}px`)
    expect(actual[8]).toBe(`${13 * 8}px`)
  })

  it('returns customized spacingByChar theme when give base size and some tokens', () => {
    const actual = createSpacingByChar(
      createSpacing({
        baseSize: 13,
        M: '120px',
        XL: '122px',
        X3L: '320px',
      }),
    )

    expect(actual['0.5']).toBe(`${13 / 2}px`)
    expect(actual[1]).toBe('13px')
    expect(actual[2]).toBe(`${13 * 2}px`)
    expect(actual[3]).toBe(`${13 * 3}px`)
    expect(actual[4]).toBe('120px')
    expect(actual[5]).toBe(`${13 * 5}px`)
    expect(actual[6]).toBe('122px')
    expect(actual[7]).toBe(`${13 * 7}px`)
    expect(actual[8]).toBe('320px')
  })
})
