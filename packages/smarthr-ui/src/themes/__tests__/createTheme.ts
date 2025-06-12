import { defaultBorder } from '../createBorder'
import { defaultLeading } from '../createLeading'
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
    expect(actual.color.SCRIM).toBe('#015')
    expect(actual.color.OVERLAY).toBe('#016')
    expect(actual.color.OUTLINE).toBe('#017')
    expect(actual.border.shorthand).toBe(
      `${defaultBorder.lineWidth} ${defaultBorder.lineStyle} #005`,
    )
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

  it('returns theme reflecting "fontSize" settings', () => {
    const actual = createTheme({
      fontSize: {
        scaleFactor: 8,
      },
    })

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

  it('returns theme "space" is the same as "spacingByChar"', () => {
    const { space, spacingByChar } = createTheme()
    expect(space).toEqual(spacingByChar)
  })
})
