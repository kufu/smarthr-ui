import { merge } from '../libs/lodash'

export type ZIndexProperty = {
  AUTO?: 'auto'
  DEFAULT?: number
  FIXED_MENU?: number
  OVERLAP_BASE?: number
  OVERLAP?: number
  FLASH_MESSAGE?: number
}

export type CreatedZindexTheme = {
  AUTO: 'auto'
  DEFAULT: number
  FIXED_MENU: number
  OVERLAP_BASE: number
  OVERLAP: number
  FLASH_MESSAGE: number
}

export const defaultZIndex = {
  AUTO: 'auto',
  DEFAULT: 0,
  FIXED_MENU: 100,
  OVERLAP_BASE: 10000,
  OVERLAP: 10500,
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
