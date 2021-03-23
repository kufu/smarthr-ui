import { merge } from '../libs/lodash'

export interface RadiusProperty {
  s?: string
  m?: string
}

export interface CreatedRadiusTheme {
  s: string
  m: string
}

export const defaultRadius: CreatedRadiusTheme = {
  s: '4px',
  m: '6px',
}

export const createRadius = (userRadius: RadiusProperty = {}) => {
  const created: CreatedRadiusTheme = merge(defaultRadius, userRadius)
  return created
}
