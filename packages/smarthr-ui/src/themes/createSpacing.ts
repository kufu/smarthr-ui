import { defaultHtmlFontSize } from './createFontSize'
export const defaultBaseSize = defaultHtmlFontSize / 2

export type SpacingProperty = {
  baseSize?: number
}

export type CreatedSpacingTheme = {
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

export const primitiveTokens = [
  0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 3.5, 4, 8, -0.25, -0.5, -0.75, -1, -1.25, -1.5, -2,
  -2.5, -3, -3.5, -4, -8,
] as const

export type CharRelativeSize = (typeof primitiveTokens)[number]
export type AbstractSize = keyof CreatedSpacingTheme

const getSpacing = (baseSize: number) => {
  const spacings = getSpacingByChar(baseSize)

  return {
    X3S: spacings[0.25],
    XXS: spacings[0.5],
    XS: spacings[1],
    S: spacings[1.5],
    M: spacings[2],
    L: spacings[2.5],
    XL: spacings[3],
    XXL: spacings[3.5],
    X3L: spacings[4],
    NONE: spacings[0],
  }
}

const getSpacingByChar = (baseSize: number) => {
  const charSize = baseSize * 2

  return primitiveTokens.reduce(
    (prev, size) => {
      prev[size] = size ? `${charSize * size}px` : '0'

      return prev
    },
    {} as { [key: string]: string },
  )
}

export const createSpacing = (userBaseSize: number = defaultBaseSize) => getSpacing(userBaseSize)
export const createSpacingByChar = (userBaseSize: number = defaultBaseSize) => {
  const spacings = getSpacingByChar(userBaseSize)

  return (size: CharRelativeSize) => spacings[size]
}

export const defaultSpacing = createSpacing()
