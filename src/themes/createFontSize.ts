import { merge } from '../libs/lodash'

export const defaultHtmlFontSize = 16

export interface FontSizeProperty {
  htmlFontSize?: number
  // respect for Starbucks...
  SHORT?: number
  TALL?: number
  GRANDE?: number
  VENTI?: number
}

export interface CreatedFontSizeTheme {
  pxToRem: (px: number) => string
  SHORT: number
  TALL: number
  GRANDE: number
  VENTI: number
}

const pxToRem = (htmlFontSize: number) => (px: number) => {
  return `${px / htmlFontSize}rem`
}

export const defaultFontSize: CreatedFontSizeTheme = {
  pxToRem: pxToRem(defaultHtmlFontSize),
  SHORT: 11,
  TALL: 14,
  GRANDE: 18,
  VENTI: 24,
}

export const createFontSize = (userFontSize: FontSizeProperty = {}) => {
  const { htmlFontSize, ...userTokens } = userFontSize
  const created: CreatedFontSizeTheme = merge(
    {
      ...defaultFontSize,
      pxToRem: pxToRem(htmlFontSize || defaultHtmlFontSize),
    },
    userTokens,
  )

  return created
}
