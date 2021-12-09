import { merge } from '../libs/lodash'
import { darken, rgba, transparentize } from 'polished'

// Allow deviations from the JavaScript naming convention to match SmartHR design guidelines
type Palette = {
  TEXT_BLACK: string
  TEXT_WHITE: string
  TEXT_GREY: string
  TEXT_DISABLED: string
  TEXT_LINK: string
  WHITE: string
  BORDER: string
  ACTION_BACKGROUND: string
  BACKGROUND: string
  COLUMN: string
  OVER_BACKGROUND: string
  HEAD: string
  BASE_GREY: string
  MAIN: string
  DANGER: string
  WARNING: string
  SCRIM: string
  OVERLAY: string
  BRAND: string
  OUTLINE: string
}

export type ColorProperty = Partial<Palette>

export type CreatedColorTheme = Palette & {
  hoverColor: (value: string, darkenAmount?: 0.05 | 0.15) => string
  disableColor: (value: string) => string
}

export type TextColors = 'TEXT_BLACK' | 'TEXT_WHITE' | 'TEXT_GREY' | 'TEXT_DISABLED' | 'TEXT_LINK'

const baseColor = {
  TEXT_BLACK: '#23221f',
  TEXT_WHITE: '#fff',
  TEXT_GREY: '#706d65',
  TEXT_DISABLED: '#c1bdb7',
  TEXT_LINK: '#0071c1',
  WHITE: '#fff',
  BORDER: '#d6d3d0',
  ACTION_BACKGROUND: '#d6d3d0',
  BACKGROUND: '#f8f7f6',
  COLUMN: '#f8f7f6',
  OVER_BACKGROUND: '#f2f1f0',
  HEAD: '#edebe8',
  BASE_GREY: '#f5f4f3',
  MAIN: '#0077c7',
  DANGER: '#e01e5a',
  WARNING: '#f56121',
  SCRIM: 'rgba(0,0,0,0.5)',
  OVERLAY: 'rgba(0,0,0,0.15)',
  BRAND: '#00c4cc',
}

export const defaultColor = { ...baseColor, OUTLINE: baseColor.MAIN }

export const createColor = (userColor: ColorProperty = {}) => {
  const created: CreatedColorTheme = merge(
    {
      hoverColor: (value: string, darkenAmount: 0.05 | 0.15 = 0.05): string =>
        darken(darkenAmount, value),
      disableColor: (value: string): string => rgba(value, 0.5),
      ...defaultColor,
    },
    userColor,
    userColor.OUTLINE == null && userColor.MAIN != null
      ? { OUTLINE: transparentize(0.5, userColor.MAIN) }
      : null,
  )
  return created
}
