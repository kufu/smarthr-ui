import { merge } from '../libs/lodash'
import { darken, rgba, transparentize } from 'polished'

// Allow deviations from the JavaScript naming convention to match SmartHR design guidelines
type Palette = {
  TEXT_BLACK: string
  TEXT_GREY: string
  TEXT_DISABLED: string
  TEXT_LINK: string
  BORDER: string
  BACKGROUND: string
  COLUMN: string
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

export const defaultColor = {
  TEXT_BLACK: '#23221f',
  TEXT_GREY: '#76736a',
  TEXT_DISABLED: '#c1bdb7',
  TEXT_LINK: '#0077c7',
  BORDER: '#d6d3d0',
  BACKGROUND: '#f8f7f6',
  COLUMN: '#f9f8f7',
  BASE_GREY: '#f5f4f3',
  MAIN: '#0077c7',
  DANGER: '#e01e5a',
  WARNING: '#ff8800',
  SCRIM: 'rgba(0,0,0,0.5)',
  OVERLAY: 'rgba(0,0,0,0.15)',
  BRAND: '#00c4cc',
}

export const createColor = (userColor: ColorProperty = {}) => {
  const created: CreatedColorTheme = merge(
    {
      hoverColor: (value: string, darkenAmount: 0.05 | 0.15 = 0.05): string =>
        darken(darkenAmount, value),
      disableColor: (value: string): string => rgba(value, 0.5),
      OUTLINE: transparentize(0.5, defaultColor.MAIN),
      ...defaultColor,
    },
    userColor,
    userColor.OUTLINE == null && userColor.MAIN != null
      ? { OUTLINE: transparentize(0.5, userColor.MAIN) }
      : null,
  )
  return created
}
