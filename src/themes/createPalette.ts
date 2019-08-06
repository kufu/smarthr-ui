import { merge } from '../libs/lodash'
import { darken } from 'polished'

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
  Hanica_Green?: string
}

export interface CreatedPaletteTheme {
  hoverColor: (value: string) => string
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
  Hanica_Green: string
}

export const defaultPalette = {
  TextBlack: '#333',
  TextGrey: '#767676',
  Border: '#d6d6d6',
  Background: '#f5f6fa',
  Column: '#f9f9f9',
  Main: '#00a5ab',
  Danger: '#ef475b',
  Warning: '#ff8800',
  Scrim: 'rgba(0,0,0,0.5)',
  Overlay: 'rgba(0,0,0,0.15)',
  Hanica_Green: '#57d0d5',
}

export const createPalette = (userPalette: PaletteProperty = {}) => {
  const created: CreatedPaletteTheme = merge(
    {
      hoverColor: (value: string): string => darken(0.05, value),
      ...defaultPalette,
    },
    userPalette,
  )
  return created
}
