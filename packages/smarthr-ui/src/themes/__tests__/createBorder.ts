import { createBorder } from '../createBorder'

describe('createBorder', () => {
  it('returns customized default border theme when give user border and user color', () => {
    const actual = createBorder({
      lineStyle: 'dotted',
      lineWidth: '13px',
      shorthand: 'double 24px black',
    })

    expect(actual.lineStyle).toBe(`dotted`)
    expect(actual.lineWidth).toBe(`13px`)
    expect(actual.shorthand).toBe('double 24px black')
  })

  it('returns customized default border theme when give user color', () => {
    const actual = createBorder(undefined, {
      BORDER: '#345',
    })

    expect(actual.shorthand).toBe(`1px solid #345`)
  })
})
