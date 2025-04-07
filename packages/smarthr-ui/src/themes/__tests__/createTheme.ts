import { defaultBorder } from '../createBorder'
import { defaultBreakpoint } from '../createBreakpoint'
import { defaultColor } from '../createColor'
import { defaultFontSize } from '../createFontSize'
import { defaultLeading } from '../createLeading'
import { defaultRadius } from '../createRadius'
import { createTheme } from '../createTheme'

describe('createTheme', () => {
  it('returns theme reflecting "color" settings', () => {
    const actual = createTheme({
      color: {
        TEXT_BLACK: '#001',
        TEXT_WHITE: '#fff',
        TEXT_GREY: '#002',
        TEXT_DISABLED: '#003',
        TEXT_LINK: '#004',
        WHITE: 'white',
        BORDER: '#005',
        ACTION_BACKGROUND: '#006',
        BACKGROUND: '#007',
        COLUMN: '#008',
        OVER_BACKGROUND: '#009',
        HEAD: '#010',
        BASE_GREY: '#011',
        MAIN: '#012',
        DANGER: '#013',
        WARNING: '#014',
        SCRIM: '#015',
        OVERLAY: '#016',
        OUTLINE: '#017',
      },
    })
    expect(actual.color.TEXT_BLACK).toBe('#001')
    expect(actual.color.TEXT_WHITE).toBe('#fff')
    expect(actual.color.TEXT_GREY).toBe('#002')
    expect(actual.color.TEXT_DISABLED).toBe('#003')
    expect(actual.color.TEXT_LINK).toBe('#004')
    expect(actual.color.WHITE).toBe('white')
    expect(actual.color.BORDER).toBe('#005')
    expect(actual.color.ACTION_BACKGROUND).toBe('#006')
    expect(actual.color.BACKGROUND).toBe('#007')
    expect(actual.color.COLUMN).toBe('#008')
    expect(actual.color.OVER_BACKGROUND).toBe('#009')
    expect(actual.color.HEAD).toBe('#010')
    expect(actual.color.BASE_GREY).toBe('#011')
    expect(actual.color.MAIN).toBe('#012')
    expect(actual.color.DANGER).toBe('#013')
    expect(actual.color.WARNING).toBe('#014')
    expect(actual.color.SCRIM).toBe('#015')
    expect(actual.color.OVERLAY).toBe('#016')
    expect(actual.color.OUTLINE).toBe('#017')
    expect(actual.border.shorthand).toBe(
      `${defaultBorder.lineWidth} ${defaultBorder.lineStyle} #005`,
    )
  })

  it('returns theme reflecting "size" settings', () => {
    const actual1 = createTheme({
      size: {
        htmlFontSize: 10,
        space: {
          XXS: 11,
          XS: 12,
          S: 13,
          M: 14,
          L: 15,
          XL: 16,
          XXL: 17,
        },
        mediaQuery: {
          SP: 22,
          TABLET: 23,
        },
      },
    })

    expect(actual1.size.pxToRem(400)).toBe(`${400 / 10}rem`)
    expect(actual1.size.space.XXS).toBe(11)
    expect(actual1.size.space.XS).toBe(12)
    expect(actual1.size.space.S).toBe(13)
    expect(actual1.size.space.M).toBe(14)
    expect(actual1.size.space.L).toBe(15)
    expect(actual1.size.space.XL).toBe(16)
    expect(actual1.size.space.XXL).toBe(17)
    expect(actual1.size.mediaQuery.SP).toBe(22)
    expect(actual1.size.mediaQuery.TABLET).toBe(23)

    const actual2 = createTheme({
      size: {
        space: {
          defaultRem: 13,
        },
      },
    })

    expect(actual2.size.space.XXS).toBe(13)
    expect(actual2.size.space.XS).toBe(13 * 2)
    expect(actual2.size.space.S).toBe(13 * 3)
    expect(actual2.size.space.M).toBe(13 * 4)
    expect(actual2.size.space.L).toBe(13 * 5)
    expect(actual2.size.space.XL).toBe(13 * 6)
    expect(actual2.size.space.XXL).toBe(13 * 7)
  })

  it('returns theme reflecting "spacing" settings', () => {
    const actual1 = createTheme({
      spacing: { baseSize: 20 },
    })

    expect(actual1.spacing.X3S).toBe('10px')
    expect(actual1.spacing.XXS).toBe('20px')
    expect(actual1.spacing.XS).toBe('40px')
    expect(actual1.spacing.S).toBe('60px')
    expect(actual1.spacing.M).toBe('80px')
    expect(actual1.spacing.L).toBe('100px')
    expect(actual1.spacing.XL).toBe('120px')
    expect(actual1.spacing.XXL).toBe('140px')
    expect(actual1.spacing.X3L).toBe('160px')
  })

  it('default settings, createSpace and createSpacing are set the same', () => {
    const actual = createTheme()
    const toPx = (size: number) => `${size}px`

    expect(actual.spacing.XXS).toBe(toPx(actual.size.space.XXS))
    expect(actual.spacing.XS).toBe(toPx(actual.size.space.XS))
    expect(actual.spacing.S).toBe(toPx(actual.size.space.S))
    expect(actual.spacing.M).toBe(toPx(actual.size.space.M))
    expect(actual.spacing.L).toBe(toPx(actual.size.space.L))
    expect(actual.spacing.XL).toBe(toPx(actual.size.space.XL))
    expect(actual.spacing.XXL).toBe(toPx(actual.size.space.XXL))
  })

  it('returns theme reflecting "fontSize" settings', () => {
    const actual = createTheme({
      fontSize: {
        htmlFontSize: 11,
        scaleFactor: 8,
      },
    })

    expect(actual.fontSize.pxToRem(55)).toBe(`${55 / 11}rem`)
    expect(actual.fontSize.XXS).toBe(`${8 / 11}rem`)
    expect(actual.fontSize.XS).toBe(`${8 / 10}rem`)
    expect(actual.fontSize.S).toBe(`${8 / 9}rem`)
    expect(actual.fontSize.M).toBe(`${8 / 8}rem`)
    expect(actual.fontSize.L).toBe(`${8 / 7}rem`)
    expect(actual.fontSize.XL).toBe(`${8 / 6}rem`)
    expect(actual.fontSize.XXL).toBe(`${8 / 5}rem`)
  })

  it('returns theme reflecting "leading" settings', () => {
    const actual = createTheme({
      leading: {
        NORMAL: 1.6,
        TIGHT: 1.125,
      },
    })

    expect(actual.leading.NORMAL).toBe(1.6)
    expect(actual.leading.TIGHT).toBe(1.125)
    expect(actual.leading.RELAXED).toBe(defaultLeading.RELAXED)
  })

  it('returns theme reflecting "breakpoint" settings', () => {
    const actual = createTheme({
      breakpoint: {
        SP: 21,
        TABLET: 22,
      },
    })

    expect(actual.breakpoint.SP).toBe(21)
    expect(actual.breakpoint.TABLET).toBe(22)
  })

  it('returns theme reflecting "border" settings', () => {
    const actual = createTheme({
      border: {
        lineWidth: 'dummy_width_3',
        lineStyle: 'dummy_style_3',
        shorthand: 'dummy_shorthand_3',
      },
    })

    expect(actual.border.lineWidth).toBe('dummy_width_3')
    expect(actual.border.lineStyle).toBe('dummy_style_3')
    expect(actual.border.shorthand).toBe('dummy_shorthand_3')
  })

  it('returns theeme reflecting "radius" settings', () => {
    const actual = createTheme({
      radius: {
        s: 'dummy_s_4',
        m: 'dummy_m_4',
      },
    })

    expect(actual.radius.s).toBe('dummy_s_4')
    expect(actual.radius.m).toBe('dummy_m_4')
  })

  it('returns theme reflecting "size" settings to "fontSize", "spacing" and "breakpoint"', () => {
    const actual = createTheme({
      size: {
        htmlFontSize: 2,
        space: {
          defaultRem: 10,
          XXS: 11,
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

    // size does not affect spacing
    expect(actual.spacing.XXS).not.toBe(11)
    expect(actual.spacing.XS).not.toBe(10 * 2)
    expect(actual.spacing.S).not.toBe(10 * 3)

    expect(actual.size.mediaQuery.SP).toBe(1000)
    expect(actual.size.mediaQuery.TABLET).toBe(defaultBreakpoint.TABLET)
    expect(actual.breakpoint.SP).toBe(1000)
    expect(actual.breakpoint.TABLET).toBe(defaultBreakpoint.TABLET)
  })

  it('returns theme reflecting "breakpoint" settings to "size.mediaQuery"', () => {
    const actual = createTheme({
      breakpoint: {
        SP: 40,
      },
    })

    expect(actual.size.mediaQuery.SP).toBe(40)
    expect(actual.size.mediaQuery.TABLET).toBe(defaultBreakpoint.TABLET)
    expect(actual.breakpoint.SP).toBe(40)
    expect(actual.breakpoint.TABLET).toBe(defaultBreakpoint.TABLET)
  })

  it('returns theme prioritizing "fontSize" and "breakpoint" settings over "size" when given size, fontSize and breakpoint settings', () => {
    const actual = createTheme({
      size: {
        htmlFontSize: 2,
        mediaQuery: {
          SP: 1000,
          TABLET: 1001,
        },
      },
      fontSize: {
        htmlFontSize: 8,
        TALL: 200,
      },
      breakpoint: {
        TABLET: 2000,
      },
    })

    expect(actual.size.pxToRem(400)).toBe(`${400 / 8}rem`)
    expect(actual.fontSize.pxToRem(400)).toBe(`${400 / 8}rem`)

    expect(actual.size.mediaQuery.SP).toBe(1000)
    expect(actual.size.mediaQuery.TABLET).toBe(2000)
    expect(actual.breakpoint.SP).toBe(1000)
    expect(actual.breakpoint.TABLET).toBe(2000)
  })

  it('returns theme "space" is the same as "spacingByChar"', () => {
    const { space, spacingByChar } = createTheme()
    expect(space).toEqual(spacingByChar)
  })
})
