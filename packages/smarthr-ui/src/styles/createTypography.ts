const defaultHtmlFontSize = 16

export interface CreatedTypographyTheme {
  htmlFontSize: number
  pxToRem: (value: number) => string
}

export const createTypography = (typography: any = {}) => {
  const created: CreatedTypographyTheme = {
    htmlFontSize: defaultHtmlFontSize,
    pxToRem: (value: number): string =>
      `${value / (typography.htmlFontSize || defaultHtmlFontSize)}rem`,
    ...typography,
  }

  return created
}
