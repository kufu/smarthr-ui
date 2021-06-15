import { merge } from '../libs/lodash'
import { defaultColor } from './createColor'

export interface ShadowProperty {
  BASE?: string
  DIALOG?: string
  OUTLINE?: string
}

export interface CreatedShadowTheme {
  BASE: string
  DIALOG: string
  OUTLINE: string
}

export const defaultShadow = {
  BASE: 'rgba(51, 51, 51, 0.15) 0 0 4px 0',
  DIALOG: 'rgba(51, 51, 51, 0.3) 0 4px 10px 0',
  OUTLINE: `0 0 0 2px white, 0 0 0 4px ${defaultColor.OUTLINE}`,
}

export const createShadow = (userShadow: ShadowProperty = {}) => {
  const created: CreatedShadowTheme = merge({ ...defaultShadow }, userShadow)
  return created
}
