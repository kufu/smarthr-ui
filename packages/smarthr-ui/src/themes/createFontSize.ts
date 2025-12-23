import { merge } from '../libs/lodash'

export const defaultHtmlFontSize = 16
const defaultScaleFactor = 6

export type FontSizeProperty = {
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
  XXS: string
  XS: string
  S: string
  M: string
  L: string
  XL: string
  XXL: string
}

export type FontSizes = 'XXS' | 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'

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

export const defaultFontSize: CreatedFontSizeTheme = getSizes(defaultScaleFactor)

export const createFontSize = (userFontSize?: FontSizeProperty): CreatedFontSizeTheme => {
  if (!userFontSize) {
    return defaultFontSize
  }

  const { scaleFactor, ...rest } = userFontSize

  return merge(
    {
      ...defaultFontSize,
    },
    scaleFactor ? getSizes(scaleFactor) : {},
    rest,
  )
}
