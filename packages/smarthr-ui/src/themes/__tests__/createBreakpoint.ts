import { createBreakpoint } from '../createBreakpoint'

describe('createBreakpoint', () => {
  it('returns customized break point theme when give user break point', () => {
    const actual = createBreakpoint({
      SP: 100,
      TABLET: 200,
    })

    expect(actual.SP).toBe(100)
    expect(actual.TABLET).toBe(200)
  })
})
