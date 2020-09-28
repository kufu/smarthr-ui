import { merge } from '../libs/lodash'

export interface ZIndexProperty {
  AUTO?: 'auto'
  DEFAULT?: number
  FIXED_MENU?: number
  OVERLAP?: number
  FLASH_MESSAGE?: number
}

export interface CreatedZindexTheme {
  AUTO?: 'auto'
  DEFAULT?: number
  FIXED_MENU?: number
  OVERLAP?: number
  FLASH_MESSAGE?: number
}

export const defaultZIndex = {
  AUTO: 'auto',
  DEFAULT: 0,
  FIXED_MENU: 100,
  OVERLAP: 10000,
  FLASH_MESSAGE: 11000,
}

export const createZIndex = (userZIndex: ZIndexProperty = {}) => {
  const created: CreatedZindexTheme = merge(
    {
      ...defaultZIndex,
    },
    userZIndex,
  )
  return created
}
