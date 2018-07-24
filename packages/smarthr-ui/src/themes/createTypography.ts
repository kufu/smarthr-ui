import { merge } from '../libs/lodash'

const defaultHtmlFontSize = 16

export interface TypographyProperty {
  htmlFontSize?: number
}

export interface CreatedTypographyTheme {
  htmlFontSize: number
  pxToRem: (value: number) => string
}

export const createTypography = (typography: TypographyProperty = {}) => {
  const created: CreatedTypographyTheme = merge(
    {
      htmlFontSize: defaultHtmlFontSize,
      pxToRem: (value: number): string =>
        `${value / (typography.htmlFontSize || defaultHtmlFontSize)}rem`,
    },
    typography,
  )

  return created
}
