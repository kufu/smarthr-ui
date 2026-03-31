import { darken } from 'polished'

import { merge } from '../libs/lodash'

import { type ColorProperty, defaultColor } from './createColor'

const semanticTextColorTokens = {
  main: defaultColor.MAIN,
  black: defaultColor.TEXT_BLACK,
  white: defaultColor.TEXT_WHITE,
  'white-darken': darken(0.05, defaultColor.TEXT_WHITE),
  disabled: defaultColor.TEXT_DISABLED,
  link: defaultColor.TEXT_LINK,
  'link-darken': darken(0.062, defaultColor.TEXT_LINK),
  grey: defaultColor.TEXT_GREY,
  danger: defaultColor.DANGER,
  'warning-yellow': defaultColor.WARNING_YELLOW,
  brand: defaultColor.BRAND,
  green: '#0f7f85',
  'color-inherit': 'inherit',
  transparent: 'transparent',
}

export const defaultTextColor = semanticTextColorTokens

type TextColorPalette = typeof defaultTextColor
export type TextColorProperty = Partial<TextColorPalette>
export type CreatedTextColorTheme = TextColorPalette

export const createTextColor = (userColor?: ColorProperty): CreatedTextColorTheme => {
  const textColor = { ...defaultTextColor }

  if (!userColor) {
    return textColor
  }

  // userColorに基づいて対応するtextColorを更新
  const overrides: Partial<TextColorPalette> = {}

  if (userColor.MAIN) {
    overrides.main = userColor.MAIN
  }
  if (userColor.TEXT_BLACK) {
    overrides.black = userColor.TEXT_BLACK
  }
  if (userColor.TEXT_WHITE) {
    overrides.white = userColor.TEXT_WHITE
    overrides['white-darken'] = darken(0.05, userColor.TEXT_WHITE)
  }
  if (userColor.TEXT_DISABLED) {
    overrides.disabled = userColor.TEXT_DISABLED
  }
  if (userColor.TEXT_LINK) {
    overrides.link = userColor.TEXT_LINK
    overrides['link-darken'] = darken(0.062, userColor.TEXT_LINK)
  }
  if (userColor.TEXT_GREY) {
    overrides.grey = userColor.TEXT_GREY
  }
  if (userColor.DANGER) {
    overrides.danger = userColor.DANGER
  }

  return merge(textColor, overrides)
}
