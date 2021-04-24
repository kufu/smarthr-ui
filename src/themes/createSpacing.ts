import { defaultHtmlFontSize } from './createFontSize'
export const defaultBaseSize = defaultHtmlFontSize / 2

export interface SpacingProperty {
  baseSize?: number
}

export interface CreatedSpacingTheme {
  X3S: string
  XXS: string
  XS: string
  S: string
  M: string
  L: string
  XL: string
  XXL: string
  X3L: string
}

export type CreatedSpacingByCharTheme = (size: CharRelativeSize) => string

const primitiveTokens = [
  0.25,
  0.5,
  0.75,
  1,
  1.25,
  1.5,
  2,
  2.5,
  3,
  3.5,
  4,
  8,
  -0.25,
  -0.5,
  -0.75,
  -1,
  -1.25,
  -1.5,
  -2,
  -2.5,
  -3,
  -3.5,
  -4,
  -8,
] as const

export type CharRelativeSize = typeof primitiveTokens[number]

const getSpacing = (baseSize: number) => {
  const spacingByChar = createSpacingByChar(baseSize)
  return {
    X3S: spacingByChar(0.25),
    XXS: spacingByChar(0.5),
    XS: spacingByChar(1),
    S: spacingByChar(1.5),
    M: spacingByChar(2),
    L: spacingByChar(2.5),
    XL: spacingByChar(3),
    XXL: spacingByChar(3.5),
    X3L: spacingByChar(4),
  }
}

const getSpacingByChar = (baseSize: number) => {
  const charSize = baseSize * 2
  return primitiveTokens
    .map((size) => {
      return { [size]: `${charSize * size}px` }
    })
    .reduce((a, c) => Object.assign(a, c), {})
}

export const createSpacing = (userBaseSize: number = defaultBaseSize) => getSpacing(userBaseSize)
export const createSpacingByChar = (userBaseSize: number = defaultBaseSize) => (
  size: CharRelativeSize,
) => getSpacingByChar(userBaseSize)[size]
