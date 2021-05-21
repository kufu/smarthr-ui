import { createLeading } from '../createLeading'

describe('createLeading', () => {
  it('returns default leading when no arguments given', () => {
    const actual = createLeading()

    expect(actual.NONE).toBe(1)
    expect(actual.NORMAL).toBe(1.5)
    expect(actual.TIGHT).toBe(1.25)
    expect(actual.RELAXED).toBe(1.75)
  })

  it('returns customed leading when give user leading', () => {
    const actual = createLeading({
      NORMAL: 3,
      TIGHT: 2,
      RELAXED: 7,
    })

    expect(actual.NORMAL).toBe(3)
    expect(actual.TIGHT).toBe(2)
    expect(actual.RELAXED).toBe(7)
  })
})
