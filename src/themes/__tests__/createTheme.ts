import { createTheme } from '../createTheme'
import { defaultColor } from '../createColor'

describe('createTheme', () => {
  it('returns theme reflecting settings when given palette settings', () => {
    const actual = createTheme({
      palette: {
        TEXT_BLACK: '#001',
      },
    })
    expect(actual.palette.TEXT_BLACK).toBe('#001')
    expect(actual.color.TEXT_BLACK).toBe('#001')
  })

  it('returns theme reflecting settings when given color settings', () => {
    const actual = createTheme({
      color: {
        TEXT_GREY: '#002',
      },
    })

    expect(actual.palette.TEXT_GREY).toBe('#002')
    expect(actual.color.TEXT_GREY).toBe('#002')
  })

  it('returns theme reflecting "color" settings as the priority when given both pelette and color settings', () => {
    const actual = createTheme({
      palette: {
        TEXT_BLACK: '#001',
        TEXT_GREY: '#002',
        TEXT_DISABLED: '#003',
        TEXT_LINK: '#004',
      },
      color: {
        TEXT_GREY: '#999',
        TEXT_LINK: '#888',
      },
    })

    expect(actual.palette.TEXT_BLACK).toBe('#001')
    expect(actual.palette.TEXT_GREY).toBe('#999')
    expect(actual.palette.TEXT_DISABLED).toBe('#003')
    expect(actual.palette.TEXT_LINK).toBe('#888')
    expect(actual.palette.BORDER).toBe(defaultColor.BORDER)
    expect(actual.color.TEXT_BLACK).toBe('#001')
    expect(actual.color.TEXT_GREY).toBe('#999')
    expect(actual.color.TEXT_DISABLED).toBe('#003')
    expect(actual.color.TEXT_LINK).toBe('#888')
    expect(actual.color.BORDER).toBe(defaultColor.BORDER)
  })
})
