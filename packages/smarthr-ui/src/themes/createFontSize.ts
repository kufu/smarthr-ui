import { merge } from '../libs/lodash'

export const defaultHtmlFontSize = 16
const defaultScaleFactor = 6

export type FontSizeProperty = {
  /** @deprecated */
  htmlFontSize?: number
  scaleFactor?: number
  XXS?: string
  XS?: string
  S?: string
  M?: string
  L?: string
  XL?: string
  XXL?: string
}

export type CreatedFontSizeTheme = {
  /** @deprecated You shouldn't use rem except for font size. use calc. */
  pxToRem: (px: number) => string
  XXS: string
  XS: string
  S: string
  M: string
  L: string
  XL: string
  XXL: string
}

export type FontSizes = 'XXS' | 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'

const pxToRem = (htmlFontSize: number) => (px: number) => `${px / htmlFontSize}rem`
const getFontSize = (scaleFactor: number, diff: number = 0) =>
  // calc(1rem * scaleFactor / (scaleFactor + diff))
  `${scaleFactor / (scaleFactor + diff)}rem`
const getSizes = (scaleFactor: number) => ({
  XXS: getFontSize(scaleFactor, 3),
  XS: getFontSize(scaleFactor, 2),
  S: getFontSize(scaleFactor, 1),
  M: getFontSize(scaleFactor),
  L: getFontSize(scaleFactor, -1),
  XL: getFontSize(scaleFactor, -2),
  XXL: getFontSize(scaleFactor, -3),
})

export const defaultFontSize: CreatedFontSizeTheme = {
  pxToRem: pxToRem(defaultHtmlFontSize),
  ...getSizes(defaultScaleFactor),
}

export const createFontSize = (userFontSize: FontSizeProperty = {}): CreatedFontSizeTheme => {
  const { htmlFontSize, scaleFactor, ...userTokens } = userFontSize

  return merge(
    {
      ...defaultFontSize,
      pxToRem: pxToRem(htmlFontSize || defaultHtmlFontSize),
    },
    scaleFactor ? getSizes(scaleFactor) : {},
    userTokens,
  )
}
