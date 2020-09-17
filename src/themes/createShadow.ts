import { merge } from '../libs/lodash'

export interface ShadowProperty {
  BASE?: string
  DIALOG?: string
}

export interface CreatedShadowTheme {
  BASE: string
  DIALOG: string
}

export const defaultShadow = {
  BASE: 'base だよー',
  DIALOG: 'dialog だよー',
}

export const createShadow = (userShadow: ShadowProperty = {}) => {
  const created: CreatedShadowTheme = merge(
    {
      ...defaultShadow,
    },
    userShadow,
  )
  return created
}
