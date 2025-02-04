export type ZIndexProperty = {
  AUTO?: 'auto'
  DEFAULT?: number
  FIXED_MENU?: number
  OVERLAP_BASE?: number
  OVERLAP?: number
  FLASH_MESSAGE?: number
}

export type CreatedZindexTheme = Required<ZIndexProperty>

export const defaultZIndex: CreatedZindexTheme = {
  AUTO: 'auto',
  DEFAULT: 0,
  FIXED_MENU: 100,
  OVERLAP_BASE: 10000,
  OVERLAP: 10500,
  FLASH_MESSAGE: 11000,
}

export const createZIndex = (userZIndex: ZIndexProperty = {}) =>
  ({
    ...defaultZIndex,
    ...userZIndex,
  }) as CreatedZindexTheme
