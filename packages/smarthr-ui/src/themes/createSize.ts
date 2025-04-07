import { merge } from '../libs/lodash'

const defaultHtmlFontSize = 16
const defaultSpaceSize = 8

export type SizeProperty = {
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

export type CreatedSizeTheme = {
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

const pxToRem = (value: number) => (font: number) => `${value / font}rem`

const getSpace = (size: number) => ({
  XXS: size,
  XS: size * 2,
  S: size * 3,
  M: size * 4,
  L: size * 5,
  XL: size * 6,
  XXL: size * 7,
})

const defaultFontSize = { SHORT: 11, TALL: 14, GRANDE: 18, VENTI: 24 }

const defaultMediaQuery = { SP: 599, TABLET: 959 }

export const createSize = (userSize: SizeProperty = {}): CreatedSizeTheme => {
  const fontSize = userSize.htmlFontSize || defaultHtmlFontSize
  const spaceSize = userSize.space?.defaultRem || defaultSpaceSize

  return merge(
    {
      pxToRem: (value: number) => pxToRem(value)(fontSize),
      space: getSpace(spaceSize),
      font: { ...defaultFontSize },
      mediaQuery: { ...defaultMediaQuery },
    },
    userSize,
  )
}
