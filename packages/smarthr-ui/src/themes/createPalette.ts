import { darken, rgba } from 'polished'

import { merge } from '../libs/lodash'

// Allow deviations from the JavaScript naming convention to match SmartHR design guidelines
export type PaletteProperty = {
  TEXT_BLACK?: string
  TEXT_GREY?: string
  TEXT_DISABLED?: string
  TEXT_LINK?: string
  BORDER?: string
  ACTION_BACKGROUND?: string
  BACKGROUND?: string
  COLUMN?: string
  OVER_BACKGROUND?: string
  HEAD?: string
  BASE_GREY?: string
  MAIN?: string
  DANGER?: string
  WARNING?: string
  SCRIM?: string
  OVERLAY?: string
  OUTLINE?: string
}

export type CreatedPaletteTheme = {
  hoverColor: (value: string) => string
  disableColor: (value: string) => string
  TEXT_BLACK: string
  TEXT_GREY: string
  TEXT_DISABLED: string
  TEXT_LINK: string
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

/**
 * @deprecated The defaultPelette will be deprecated, please use defaultColor instead
 */
export const defaultPalette = {
  TEXT_BLACK: '#23221e',
  TEXT_GREY: '#706d65',
  TEXT_DISABLED: '#c1bdb7',
  TEXT_LINK: '#0071c1',
  BORDER: '#d6d3d0',
  ACTION_BACKGROUND: '#d6d3d0',
  BACKGROUND: '#f8f7f6',
  COLUMN: '#f8f7f6',
  OVER_BACKGROUND: '#f2f1f0',
  HEAD: '#edebe8',
  BASE_GREY: '#f5f4f3',
  MAIN: '#0077c7',
  DANGER: '#e01e5a',
  WARNING: '#ff8800',
  SCRIM: rgba('#030302', 0.5),
  OVERLAY: rgba('#030302', 0.15),
  BRAND: '#00c4cc',
}

export const createPalette = (userPalette: PaletteProperty = {}) => {
  const created: CreatedPaletteTheme = merge(
    {
      hoverColor: (value: string): string => darken(0.05, value),
      disableColor: (value: string): string => rgba(value, 0.5),
      OUTLINE: defaultPalette.MAIN,
      ...defaultPalette,
    },
    userPalette,
    !userPalette.OUTLINE && userPalette.MAIN ? { OUTLINE: userPalette.MAIN } : null,
  )
  return created
}
