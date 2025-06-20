import { merge } from '../libs/lodash'

export type ZIndexProperty = {
  AUTO?: 'auto'
  DEFAULT?: number
  FIXED_MENU?: number
  OVERLAP_BASE?: number
  OVERLAP?: number
}

export type CreatedZindexTheme = {
  AUTO: 'auto'
  DEFAULT: number
  FIXED_MENU: number
  OVERLAP_BASE: number
  OVERLAP: number
}

export const defaultZIndex: CreatedZindexTheme = {
  AUTO: 'auto',
  DEFAULT: 0,
  FIXED_MENU: 100,
  OVERLAP_BASE: 10000,
  OVERLAP: 10500,
}

export const createZIndex = (userZIndex?: ZIndexProperty): CreatedZindexTheme => {
  if (!userZIndex) {
    return defaultZIndex
  }

  return merge(
    {
      ...defaultZIndex,
    },
    userZIndex,
  )
}
