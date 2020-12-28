import { createBreakPoint } from '../createBreakPoint'
import { createSize } from '../createSize'

describe('createBreakPoint', () => {
  it('returns same break point theme with createSize', () => {
    const actual = createBreakPoint()
    const expected = createSize()

    expect(actual.SP).toBe(expected.mediaQuery.SP)
    expect(actual.TABLET).toBe(expected.mediaQuery.TABLET)
  })

  it('returns customized break point theme when give user break point', () => {
    const actual = createBreakPoint({
      SP: 100,
      TABLET: 200,
    })

    expect(actual.SP).toBe(100)
    expect(actual.TABLET).toBe(200)
  })
})
