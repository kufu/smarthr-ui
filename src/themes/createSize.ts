import { merge } from '../libs/lodash'

const defaultHtmlFontSize = 16
const defaultSpace = 8

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

const defaultSize = {
  font: {
    SHORT: 11,
    TALL: 14,
    GRANDE: 18,
    VENTI: 24,
  },
  mediaQuery: {
    SP: 599,
    TABLET: 959,
  },
}

export const createSize = (userSize: SizeProperty = {}) => {
  const space = userSize.space || {}
  const XXS = space.defaultRem || defaultSpace
  const created: CreatedSizeTheme = merge(
    {
      pxToRem: (value: number): string =>
        `${value / (userSize.htmlFontSize || defaultHtmlFontSize)}rem`,
      space: {
        XXS,
        XS: XXS * 2,
        S: XXS * 3,
        M: XXS * 4,
        L: XXS * 5,
        XL: XXS * 6,
        XXL: XXS * 7,
      },
      ...defaultSize,
    },
    userSize,
  )

  return created
}
