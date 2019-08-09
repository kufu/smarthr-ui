import { merge } from '../libs/lodash'

const defaultHtmlFontSize = 16
const defaultSpaceSize = 8

export interface SizeProperty {
  htmlFontSize?: number
  space?: {
    defaultRem?: number
    XXS?: number
    XS?: number
    S?: number
    M?: number
    L?: number
    XL?: number
    XXL?: number
  }
  // respect for Starbucks...
  font?: {
    SHORT?: number
    TALL?: number
    GRANDE?: number
    VENTI?: number
  }
  mediaQuery?: {
    SP?: number
    TABLET?: number
  }
}

export interface CreatedSizeTheme {
  pxToRem: (value: number) => string
  space: {
    XXS: number
    XS: number
    S: number
    M: number
    L: number
    XL: number
    XXL: number
  }
  font: {
    SHORT: number
    TALL: number
    GRANDE: number
    VENTI: number
  }
  mediaQuery: {
    SP: number
    TABLET: number
  }
}

const pxToRem = (value: number) => (font: number) => {
  return `${value / font}rem`
}

export const defaultFontSize = { SHORT: 11, TALL: 14, GRANDE: 18, VENTI: 24 }

export const defaultMediaQuery = { SP: 599, TABLET: 959 }

export const defaultspace = {
  XXS: defaultSpaceSize,
  XS: defaultSpaceSize * 2,
  S: defaultSpaceSize * 3,
  M: defaultSpaceSize * 4,
  L: defaultSpaceSize * 5,
  XL: defaultSpaceSize * 6,
  XXL: defaultSpaceSize * 7,
}

export const defaultSize: CreatedSizeTheme = {
  pxToRem: (value: number) => pxToRem(value)(defaultHtmlFontSize),
  font: defaultFontSize,
  space: defaultspace,
  mediaQuery: defaultMediaQuery,
}

export const createSize = (userSize: SizeProperty = {}) => {
  const space = userSize.space || {}
  const XXS = space.defaultRem || defaultSpaceSize
  const created: CreatedSizeTheme = merge(
    {
      pxToRem: (value: number) => pxToRem(value)(userSize.htmlFontSize || defaultHtmlFontSize),
      space: {
        XXS,
        XS: XXS * 2,
        S: XXS * 3,
        M: XXS * 4,
        L: XXS * 5,
        XL: XXS * 6,
        XXL: XXS * 7,
      },
      font: defaultFontSize,
      mediaQuery: defaultMediaQuery,
    },
    userSize,
  )

  return created
}
