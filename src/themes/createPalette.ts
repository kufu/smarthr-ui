import { merge } from '../libs/lodash'
import { darken, rgba, transparentize } from 'polished'

// Allow deviations from the JavaScript naming convention to match SmartHR design guidelines
export interface PaletteProperty {
  TEXT_BLACK?: string
  TEXT_GREY?: string
  TEXT_DISABLED?: string
  TEXT_LINK?: string
  BORDER?: string
  BACKGROUND?: string
  COLUMN?: string
  MAIN?: string
  DANGER?: string
  WARNING?: string
  SCRIM?: string
  OVERLAY?: string
  OUTLINE?: string
}

export interface CreatedPaletteTheme {
  hoverColor: (value: string) => string
  disableColor: (value: string) => string
  TEXT_BLACK: string
  TEXT_GREY: string
  TEXT_DISABLED: string
  TEXT_LINK: string
  BORDER: string
  BACKGROUND: string
  COLUMN: string
  MAIN: string
  DANGER: string
  WARNING: string
  SCRIM: string
  OVERLAY: string
  HEADER_GREEN: string
  BRAND: string
  OUTLINE: string
}

export const defaultPalette = {
  TEXT_BLACK: '#333',
  TEXT_GREY: '#767676',
  TEXT_DISABLED: '#c1c1c1',
  TEXT_LINK: '#007bc2',
  BORDER: '#d6d6d6',
  BACKGROUND: '#f5f6fa',
  COLUMN: '#f9f9f9',
  MAIN: '#00a5ab',
  DANGER: '#ef475b',
  WARNING: '#ff8800',
  SCRIM: 'rgba(0,0,0,0.5)',
  OVERLAY: 'rgba(0,0,0,0.15)',
  HEADER_GREEN: '#57d0d5',
  BRAND: '#00c4cc',
}

export const createPalette = (userPalette: PaletteProperty = {}) => {
  const created: CreatedPaletteTheme = merge(
    {
      hoverColor: (value: string): string => darken(0.05, value),
      disableColor: (value: string): string => rgba(value, 0.5),
      OUTLINE: transparentize(0.5, defaultPalette.MAIN),
      ...defaultPalette,
    },
    userPalette,
    userPalette.OUTLINE == null && userPalette.MAIN != null
      ? { OUTLINE: transparentize(0.5, userPalette.MAIN) }
      : null,
  )
  return created
}
