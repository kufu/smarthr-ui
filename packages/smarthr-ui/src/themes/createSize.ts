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

const pxToRem = (font: number) => (value: number) => `${value / font}rem`
const defaultPxToRem = pxToRem(defaultHtmlFontSize)

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

const defaultSpace = getSpace(defaultSpaceSize)

/**
 * @deprecated The defaultSize will be deprecated, please use defaultFontSize, defaultSpacing or defaultBreakPoint instead
 */
export const defaultSize: CreatedSizeTheme = {
  pxToRem: (value: number) => defaultPxToRem(value),
  font: defaultFontSize,
  space: defaultSpace,
  mediaQuery: defaultMediaQuery,
}

export const createSize = (userSize: SizeProperty = {}) => {
  const space = userSize.space || {}
  const memoizedPxToRem = userSize.htmlFontSize ? pxToRem(userSize.htmlFontSize) : defaultPxToRem
  const created: CreatedSizeTheme = merge(
    {
      pxToRem: (value: number) => memoizedPxToRem(value),
      space: getSpace(space.defaultRem || defaultSpaceSize),
      font: { ...defaultFontSize },
      mediaQuery: { ...defaultMediaQuery },
    },
    userSize,
  )

  return created
}
