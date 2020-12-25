import { merge } from '../libs/lodash'

const defaultSize = 8

export interface SpacingProperty {
  defaultRem?: number
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

const getSpacing = (size: number) => {
  return {
    XXS: size,
    XS: size * 2,
    S: size * 3,
    M: size * 4,
    L: size * 5,
    XL: size * 6,
    XXL: size * 7,
  }
}

export const defaultSpacing = getSpacing(defaultSize)

export const createSpacing = (userSpacing: SpacingProperty = {}) => {
  const { defaultRem, ...userTokens } = userSpacing
  const XXS = defaultRem || defaultSize
  const created: CreatedSpacingTheme = merge(getSpacing(XXS), userTokens)

  return created
}
