import { merge } from '../libs/lodash'

export const defaultBaseSize = 8

export interface SpacingProperty {
  baseSize?: number
  XXS?: number
  XS?: number
  S?: number
  M?: number
  L?: number
  XL?: number
  XXL?: number
}

export interface CreatedSpacingTheme {
  XXS: number
  XS: number
  S: number
  M: number
  L: number
  XL: number
  XXL: number
}

const getSpacing = (baseSize: number) => {
  return {
    XXS: baseSize,
    XS: baseSize * 2,
    S: baseSize * 3,
    M: baseSize * 4,
    L: baseSize * 5,
    XL: baseSize * 6,
    XXL: baseSize * 7,
  }
}

export const defaultSpacing = getSpacing(defaultBaseSize)

export const createSpacing = (userSpacing: SpacingProperty = {}) => {
  const { baseSize, ...userTokens } = userSpacing
  const created: CreatedSpacingTheme = merge(getSpacing(baseSize || defaultBaseSize), userTokens)

  return created
}
