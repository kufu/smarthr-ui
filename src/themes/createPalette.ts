import { merge } from '../libs/lodash'

// Allow deviations from the JavaScript naming convention to match SmartHR design guidelines
export interface PaletteProperty {
  TextBlack?: string
  TextGrey?: string
  Border?: string
  Background?: string
  Column?: string
  Main?: string
  Danger?: string
  Warning?: string
  Scrim?: string
  Overlay?: string
}

export interface CreatedPaletteTheme {
  TextBlack: string
  TextGrey: string
  Border: string
  Background: string
  Column: string
  Main: string
  Danger: string
  Warning: string
  Scrim: string
  Overlay: string
}

export const defaultPalette: CreatedPaletteTheme = {
  TextBlack: '#333',
  TextGrey: '#767676',
  Border: '#D6D6D6',
  Background: '#F5F6FA',
  Column: '#F9F9F9',
  Main: '#00A5AB',
  Danger: '#EF475B',
  Warning: '#FF8800',
  Scrim: 'rgba(0,0,0,0.5)',
  Overlay: 'rgba(0,0,0,0.15)',
}

export const createPalette = (userPalette: PaletteProperty = {}) => {
  const created = merge(defaultPalette, userPalette)
  return created
}
