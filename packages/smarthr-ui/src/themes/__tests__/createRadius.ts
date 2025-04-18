import { createRadius } from '../createRadius'

describe('createRadius', () => {
  it('returns customized radius theme when give user radius', () => {
    const actual = createRadius({
      s: '12px',
      m: '47px',
    })

    expect(actual.s).toBe('12px')
    expect(actual.m).toBe('47px')
  })
})
