import { merge } from '../libs/lodash'

const defaultHtmlFontSize = 16

export interface SizeProperty {
  htmlFontSize?: number
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

const defaultFontSize = { SHORT: 11, TALL: 14, GRANDE: 18, VENTI: 24 }

const defaultMediaQuery = { SP: 599, TABLET: 959 }

/**
 * @deprecated The defaultSize will be deprecated, please use defaultFontSize or defaultBreakPoint instead
 */
export const defaultSize: CreatedSizeTheme = {
  pxToRem: (value: number) => pxToRem(value)(defaultHtmlFontSize),
  font: defaultFontSize,
  mediaQuery: defaultMediaQuery,
}

export const createSize = (userSize: SizeProperty = {}) => {
  const created: CreatedSizeTheme = merge(
    {
      pxToRem: (value: number) => pxToRem(value)(userSize.htmlFontSize || defaultHtmlFontSize),
      font: { ...defaultFontSize },
      mediaQuery: { ...defaultMediaQuery },
    },
    userSize,
  )

  return created
}
