import { createColor } from '../createColor'

describe('createColor', () => {
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
