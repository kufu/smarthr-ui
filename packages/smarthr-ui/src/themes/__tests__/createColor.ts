import { createColor } from '../createColor'
import { createPalette } from '../createPalette'

describe('createColor', () => {
  it('returns same color theme with createPalette', () => {
    const actual = createColor()
    const expected = createPalette()
    expect(actual.TEXT_BLACK).toBe(expected.TEXT_BLACK)
    expect(actual.TEXT_GREY).toBe(expected.TEXT_GREY)
    expect(actual.TEXT_DISABLED).toBe(expected.TEXT_DISABLED)
    expect(actual.TEXT_LINK).toBe(expected.TEXT_LINK)
    expect(actual.BORDER).toBe(expected.BORDER)
    expect(actual.BACKGROUND).toBe(expected.BACKGROUND)
    expect(actual.COLUMN).toBe(expected.COLUMN)
    expect(actual.BASE_GREY).toBe(expected.BASE_GREY)
    expect(actual.MAIN).toBe(expected.MAIN)
    expect(actual.DANGER).toBe(expected.DANGER)
    expect(actual.WARNING).toBe(expected.WARNING)
    expect(actual.SCRIM).toBe(expected.SCRIM)
    expect(actual.OVERLAY).toBe(expected.OVERLAY)
    expect(actual.BRAND).toBe(expected.BRAND)
    expect(actual.OUTLINE).toBe(expected.OUTLINE)
    expect(actual.hoverColor('#123')).toBe(expected.hoverColor('#123'))
    expect(actual.disableColor('#345')).toBe(expected.disableColor('#345'))
  })

  it('returns customized color theme when give user color', () => {
    const actual = createColor({
      TEXT_BLACK: '#000',
      TEXT_WHITE: '#fff',
      TEXT_GREY: '#111',
      TEXT_DISABLED: '#222',
      TEXT_LINK: '#333',
      WHITE: 'white',
      BORDER: '#444',
      BACKGROUND: '#555',
      COLUMN: '#666',
      BASE_GREY: '#777',
      MAIN: '#888',
      DANGER: '#999',
      WARNING: '#aaa',
      SCRIM: '#bbb',
      OVERLAY: '#ccc',
    })
    expect(actual.TEXT_BLACK).toBe('#000')
    expect(actual.TEXT_WHITE).toBe('#fff')
    expect(actual.TEXT_GREY).toBe('#111')
    expect(actual.TEXT_DISABLED).toBe('#222')
    expect(actual.TEXT_LINK).toBe('#333')
    expect(actual.WHITE).toBe('white')
    expect(actual.BORDER).toBe('#444')
    expect(actual.BACKGROUND).toBe('#555')
    expect(actual.COLUMN).toBe('#666')
    expect(actual.BASE_GREY).toBe('#777')
    expect(actual.MAIN).toBe('#888')
    expect(actual.DANGER).toBe('#999')
    expect(actual.WARNING).toBe('#aaa')
    expect(actual.SCRIM).toBe('#bbb')
    expect(actual.OVERLAY).toBe('#ccc')
  })
})
