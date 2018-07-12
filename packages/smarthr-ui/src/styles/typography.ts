const fontSize = 14
const htmlFontSize = 16
const coef = fontSize / 14

export const typography = {
  pxToRem: (value: number): string => `${(value / htmlFontSize) * coef}rem`,
}
