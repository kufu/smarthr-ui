import { merge } from '../libs/lodash'

const defaultHtmlFontSize = 16
const defaultSpace = 8

export interface SizeProperty {
  htmlFontSize?: number
  space?: {
    default?: number
    xxs?: number
    xs?: number
    s?: number
    m?: number
    l?: number
    xl?: number
    xxl?: number
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
  mediaQuery: {
    sp: number
    tablet: number
  }
}

export const createSize = (userSize: SizeProperty = {}) => {
  const space = userSize.space || {}
  const created: CreatedSizeTheme = merge(
    {
      pxToRem: (value: number): string =>
        `${value / (userSize.htmlFontSize || defaultHtmlFontSize)}rem`,
      space: {
        xxs: space.default || defaultSpace,
        xs: (space.default || defaultSpace) * 2,
        s: (space.default || defaultSpace) * 3,
        m: (space.default || defaultSpace) * 4,
        l: (space.default || defaultSpace) * 5,
        xl: (space.default || defaultSpace) * 6,
        xxl: (space.default || defaultSpace) * 7,
      },
      mediaQuery: {
        sp: 599,
        tablet: 959,
      },
    },
    userSize,
  )

  return created
}
