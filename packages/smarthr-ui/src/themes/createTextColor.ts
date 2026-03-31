import { darken } from 'polished'

import { merge } from '../libs/lodash'

import { type ColorProperty, defaultColor } from './createColor'

export const defaultTextColor = {
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

type TextColorPalette = typeof defaultTextColor
export type TextColorProperty = Partial<TextColorPalette>
export type CreatedTextColorTheme = TextColorPalette

export const createTextColor = (userColor?: ColorProperty): CreatedTextColorTheme => {
  if (!userColor) {
    return defaultTextColor
  }

  // userColorでマージされた色パレットを取得
  const color = merge(defaultColor, userColor)

  // 更新された色からテキスト色を再生成
  return {
    main: color.MAIN,
    black: color.TEXT_BLACK,
    white: color.TEXT_WHITE,
    'white-darken': darken(0.05, color.TEXT_WHITE),
    disabled: color.TEXT_DISABLED,
    link: color.TEXT_LINK,
    'link-darken': darken(0.062, color.TEXT_LINK),
    grey: color.TEXT_GREY,
    danger: color.DANGER,
    'warning-yellow': color.WARNING_YELLOW,
    brand: color.BRAND,
    green: '#0f7f85',
    'color-inherit': 'inherit' as const,
    transparent: 'transparent' as const,
  }
}
