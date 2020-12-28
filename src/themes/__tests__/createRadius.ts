import { createRadius } from '../createRadius'
import { createFrame } from '../createFrame'

describe('createRadius', () => {
  it('retuns same radius theme with createFrame', () => {
    const actual = createRadius()
    const expected = createFrame()

    expect(actual.s).toBe(expected.border.radius.s)
    expect(actual.m).toBe(expected.border.radius.m)
  })

  it('returns customized radius theme when give user radius', () => {
    const actual = createRadius({
      s: '12px',
      m: '47px',
    })

    expect(actual.s).toBe('12px')
    expect(actual.m).toBe('47px')
  })
})
