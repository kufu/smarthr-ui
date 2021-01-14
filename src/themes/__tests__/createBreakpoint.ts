import { createBreakpoint } from '../createBreakpoint'
import { createSize } from '../createSize'

describe('createBreakpoint', () => {
  it('returns same break point theme with createSize', () => {
    const actual = createBreakpoint()
    const expected = createSize()

    expect(actual.SP).toBe(expected.mediaQuery.SP)
    expect(actual.TABLET).toBe(expected.mediaQuery.TABLET)
  })

  it('returns customized break point theme when give user break point', () => {
    const actual = createBreakpoint({
      SP: 100,
      TABLET: 200,
    })

    expect(actual.SP).toBe(100)
    expect(actual.TABLET).toBe(200)
  })
})
