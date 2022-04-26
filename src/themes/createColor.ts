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

const BLACK = '#23221f'
const greyScale = {
  GREY_5: '#f8f7f6',
  GREY_6: '#f5f4f3',
  GREY_7: '#f2f1f0',
  GREY_9: '#edebe8',
  GREY_20: '#d6d3d0',
  GREY_30: '#c1bdb7',
  GREY_65: '#706d65',
}
const transparencyScale = {
  TRANSPARENCY_15: rgba(BLACK, 0.15),
  TRANSPARENCY_30: rgba(BLACK, 0.3),
  TRANSPARENCY_50: rgba(BLACK, 0.5),
}
const primitiveTokens = {
  WHITE: '#fff',
  BLACK,
  BLUE_100: '#0077c7',
  BLUE_101: '#0071c1',
  RED_100: '#e01e5a',
  ORANGE_100: '#ff8800',
  SMARTHR_BLUE: '#00c4cc',
}

const semanticTokens = {
  TEXT_BLACK: primitiveTokens.BLACK,
  TEXT_WHITE: primitiveTokens.WHITE,
  TEXT_GREY: greyScale.GREY_65,
  TEXT_DISABLED: greyScale.GREY_30,
  TEXT_LINK: primitiveTokens.BLUE_101,
  WHITE: primitiveTokens.WHITE,
  BACKGROUND: greyScale.GREY_5,
  COLUMN: greyScale.GREY_5,
  BASE_GREY: greyScale.GREY_6,
  OVER_BACKGROUND: greyScale.GREY_7,
  HEAD: greyScale.GREY_9,
  BORDER: greyScale.GREY_20,
  ACTION_BACKGROUND: greyScale.GREY_20,
  MAIN: primitiveTokens.BLUE_100,
  OUTLINE: primitiveTokens.BLUE_100,
  DANGER: primitiveTokens.RED_100,
  WARNING: primitiveTokens.ORANGE_100,
  OVERLAY: transparencyScale.TRANSPARENCY_15,
  SCRIM: transparencyScale.TRANSPARENCY_50,
  BRAND: primitiveTokens.SMARTHR_BLUE,
}

export const defaultColor = { ...semanticTokens, ...greyScale, ...transparencyScale }

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
