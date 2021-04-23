import { merge } from '../libs/lodash'

const defaultBaseSize = 8

export interface SpacingProperty {
  baseSize?: number
  X3S?: string
  XXS?: string
  XS?: string
  S?: string
  M?: string
  L?: string
  XL?: string
  XXL?: string
  X3L?: string
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

export interface CreatedSpacingByChar {
  0.5?: string
  1?: string
  2?: string
  3?: string
  4?: string
  5?: string
  6?: string
  7?: string
  8?: string
}

const getSpacing = (baseSize: number) => {
  return {
    X3S: `${baseSize / 2}px`,
    XXS: `${baseSize}px`,
    XS: `${baseSize * 2}px`,
    S: `${baseSize * 3}px`,
    M: `${baseSize * 4}px`,
    L: `${baseSize * 5}px`,
    XL: `${baseSize * 6}px`,
    XXL: `${baseSize * 7}px`,
    X3L: `${baseSize * 8}px`,
  }
}

const getSpacingByChar = (spacing: CreatedSpacingTheme) => {
  return {
    0.5: spacing.X3S,
    1: spacing.XXS,
    2: spacing.XS,
    3: spacing.S,
    4: spacing.M,
    5: spacing.L,
    6: spacing.XL,
    7: spacing.XXL,
    8: spacing.X3L,
  }
}

export const defaultSpacing = getSpacing(defaultBaseSize)

export const createSpacing = (userSpacing: SpacingProperty = {}) => {
  const { baseSize, ...userTokens } = userSpacing
  const created: CreatedSpacingTheme = merge(getSpacing(baseSize || defaultBaseSize), userTokens)

  return created
}

export const defaultSpacingByChar = getSpacingByChar(defaultSpacing)
export const createSpacingByChar = (spacing: CreatedSpacingTheme) => getSpacingByChar(spacing)
