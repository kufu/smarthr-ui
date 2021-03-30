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

  it('returns theme reflecting settings when given size settings', () => {
    const actual = createTheme({
      size: {
        htmlFontSize: 2,
        space: {
          defaultRem: 10,
          XXS: 11,
        },
        font: {
          SHORT: 100,
        },
        mediaQuery: {
          SP: 1000,
        },
      },
    })

    expect(actual.size.pxToRem(400)).toBe(`${400 / 2}rem`)
    expect(actual.fontSize.pxToRem(400)).toBe(`${400 / 2}rem`)

    expect(actual.size.space.XXS).toBe(11)
    expect(actual.size.space.XS).toBe(10 * 2)
    expect(actual.size.space.S).toBe(10 * 3)
    expect(actual.spacing.XXS).toBe(11)
    expect(actual.spacing.XS).toBe(10 * 2)
    expect(actual.spacing.S).toBe(10 * 3)

    expect(actual.size.font.SHORT).toBe(100)
    expect(actual.fontSize.SHORT).toBe(100)

    expect(actual.size.mediaQuery.SP).toBe(1000)
    expect(actual.breakpoint.SP).toBe(1000)
  })

  it('returns theme reflecting settings when given spacing settings', () => {
    const actual = createTheme({
      spacing: {
        baseSize: 20,
        XXS: 21,
      },
    })

    expect(actual.size.space.XXS).toBe(21)
    expect(actual.size.space.XS).toBe(20 * 2)
    expect(actual.size.space.S).toBe(20 * 3)
    expect(actual.spacing.XXS).toBe(21)
    expect(actual.spacing.XS).toBe(20 * 2)
    expect(actual.spacing.S).toBe(20 * 3)
  })

  it('returns theme reflecting settings when given fontSize settings', () => {
    const actual = createTheme({
      fontSize: {
        SHORT: 30,
      },
    })

    expect(actual.size.font.SHORT).toBe(30)
    expect(actual.fontSize.SHORT).toBe(30)
  })

  it('returns theme reflecting settings when given breakpoint settings', () => {
    const actual = createTheme({
      breakpoint: {
        SP: 40,
      },
    })

    expect(actual.size.mediaQuery.SP).toBe(40)
    expect(actual.breakpoint.SP).toBe(40)
  })

  it('returns theme reflecting settings when given frame settings', () => {
    const actual = createTheme({
      frame: {
        border: {
          lineWidth: 'dummy_width',
          default: 'dummy_default',
          radius: {
            s: 'dummy_s',
          },
        },
      },
    })

    expect(actual.frame.border.lineWidth).toBe('dummy_width')
    expect(actual.frame.border.default).toBe('dummy_default')
    expect(actual.border.lineWidth).toBe('dummy_width')
    expect(actual.border.shorthand).toBe('dummy_default')

    expect(actual.frame.border.radius.s).toBe('dummy_s')
    expect(actual.radius.s).toBe('dummy_s')
  })

  it('returns theme reflecting settings when given border settings', () => {
    const actual = createTheme({
      border: {
        lineWidth: 'dummy_width',
        shorthand: 'dummy_shorthand',
      },
    })

    expect(actual.frame.border.lineWidth).toBe('dummy_width')
    expect(actual.frame.border.default).toBe('dummy_shorthand')
    expect(actual.border.lineWidth).toBe('dummy_width')
    expect(actual.border.shorthand).toBe('dummy_shorthand')
  })

  it('returns theme reflecting settings when given radius settings', () => {
    const actual = createTheme({
      radius: {
        s: 'dummy_s',
      },
    })

    expect(actual.frame.border.radius.s).toBe('dummy_s')
    expect(actual.radius.s).toBe('dummy_s')
  })
})
