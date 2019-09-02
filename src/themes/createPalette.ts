import { merge } from '../libs/lodash'
import { darken, rgba } from 'polished'

// Allow deviations from the JavaScript naming convention to match SmartHR design guidelines
export interface PaletteProperty {
  TEXT_BLACK?: string
  TEXT_GREY?: string
  BORDER?: string
  BACKGROUND?: string
  COLUMN?: string
  MAIN?: string
  DANGER?: string
  WARNING?: string
  SCRIM?: string
  OVERLAY?: string
}

export interface CreatedPaletteTheme {
  hoverColor: (value: string) => string
  disableColor: (value: string) => string
  TEXT_BLACK: string
  TEXT_GREY: string
  BORDER: string
  BACKGROUND: string
  COLUMN: string
  MAIN: string
  DANGER: string
  WARNING: string
  SCRIM: string
  OVERLAY: string
}

const hoverColor = (value: string): string => darken(0.05, value)
const disableColor = (value: string): string => rgba(value, 0.5)

export const defaultPalette: CreatedPaletteTheme = {
  hoverColor,
  disableColor,
  TEXT_BLACK: '#333',
  TEXT_GREY: '#767676',
  BORDER: '#d6d6d6',
  BACKGROUND: '#f5f6fa',
  COLUMN: '#f9f9f9',
  MAIN: '#00a5ab',
  DANGER: '#ef475b',
  WARNING: '#ff8800',
  SCRIM: 'rgba(0,0,0,0.5)',
  OVERLAY: 'rgba(0,0,0,0.15)',
}

export const createPalette = (userPalette: PaletteProperty = {}) => {
  const created: CreatedPaletteTheme = merge(
    {
      ...defaultPalette,
    },
    userPalette,
  )
  return created
}
