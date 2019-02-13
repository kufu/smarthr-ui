import { merge } from '../libs/lodash'

const defaultHtmlFontSize = 16
const defaultSpace = 8

export interface SizeProperty {
  htmlFontSize?: number
  space?: {
    defaultRem?: number
    xxs?: number
    xs?: number
    s?: number
    m?: number
    l?: number
    xl?: number
    xxl?: number
  }
  // respect for Starbucks...
  font?: {
    tasting?: string
    short?: string
    tall?: string
    grande?: string
    venti?: string
    trenta?: string
  }
  mediaQuery?: {
    sp?: number
    tablet?: number
  }
}

export interface CreatedSizeTheme {
  pxToRem: (value: number) => string
  space: {
    xxs: number
    xs: number
    s: number
    m: number
    l: number
    xl: number
    xxl: number
  }
  font: {
    tasting: string
    short: string
    tall: string
    grande: string
    venti: string
    trenta: string
  }
  mediaQuery: {
    sp: number
    tablet: number
  }
}

const defaultSize = {
  font: {
    tasting: '1.2rem',
    short: '1.3rem',
    tall: '1.4rem',
    grande: '1.6rem',
    venti: '2.0rem',
    trenta: '2.2rem',
  },
  mediaQuery: {
    sp: 599,
    tablet: 959,
  },
}

export const createSize = (userSize: SizeProperty = {}) => {
  const space = userSize.space || {}
  const xxs = space.defaultRem || defaultSpace
  const created: CreatedSizeTheme = merge(
    {
      pxToRem: (value: number): string =>
        `${value / (userSize.htmlFontSize || defaultHtmlFontSize)}rem`,
      space: {
        xxs,
        xs: xxs * 2,
        s: xxs * 3,
        m: xxs * 4,
        l: xxs * 5,
        xl: xxs * 6,
        xxl: xxs * 7,
      },
      ...defaultSize,
    },
    userSize,
  )

  return created
}
