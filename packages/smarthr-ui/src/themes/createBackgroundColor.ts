import { darken } from 'polished'

import { merge } from '../libs/lodash'

import { type ColorProperty, defaultColor } from './createColor'

export const defaultBackgroundColor = {
  black: defaultColor.GREY_100,
  white: defaultColor.WHITE,
  'white-darken': darken(0.05, defaultColor.WHITE),
  background: defaultColor.BACKGROUND,
  border: defaultColor.GREY_20,
  brand: defaultColor.BRAND,
  column: defaultColor.COLUMN,
  'column-darken': darken(0.05, defaultColor.COLUMN),
  'base-grey': defaultColor.BASE_GREY,
  'over-background': defaultColor.OVER_BACKGROUND,
  head: defaultColor.HEAD,
  'head-darken': darken(0.05, defaultColor.HEAD),
  'action-background': defaultColor.ACTION_BACKGROUND,
  main: defaultColor.MAIN,
  'main-darken': darken(0.05, defaultColor.MAIN),
  danger: defaultColor.DANGER,
  'danger-darken': darken(0.05, defaultColor.DANGER),
  'warning-yellow': defaultColor.WARNING_YELLOW,
  'warning-yellow-darken': darken(0.05, defaultColor.WARNING_YELLOW),
  overlay: defaultColor.OVERLAY,
  scrim: defaultColor.SCRIM,
  green: '#0f7f85',
  grey: {
    9: defaultColor.GREY_9,
    '9-darken': darken(0.05, defaultColor.GREY_9),
  },
  inherit: 'inherit',
  transparent: 'transparent',
}

export type CreatedBackgroundColorTheme = typeof defaultBackgroundColor

export const createBackgroundColor = (userColor?: ColorProperty): CreatedBackgroundColorTheme => {
  if (!userColor) {
    return defaultBackgroundColor
  }

  // userColorでマージされた色パレットを取得し、背景色を再生成
  const color = merge(defaultColor, userColor)

  return {
    black: color.GREY_100,
    white: color.WHITE,
    'white-darken': darken(0.05, color.WHITE),
    background: color.BACKGROUND,
    border: color.GREY_20,
    brand: color.BRAND,
    column: color.COLUMN,
    'column-darken': darken(0.05, color.COLUMN),
    'base-grey': color.BASE_GREY,
    'over-background': color.OVER_BACKGROUND,
    head: color.HEAD,
    'head-darken': darken(0.05, color.HEAD),
    'action-background': color.ACTION_BACKGROUND,
    main: color.MAIN,
    'main-darken': darken(0.05, color.MAIN),
    danger: color.DANGER,
    'danger-darken': darken(0.05, color.DANGER),
    'warning-yellow': color.WARNING_YELLOW,
    'warning-yellow-darken': darken(0.05, color.WARNING_YELLOW),
    overlay: color.OVERLAY,
    scrim: color.SCRIM,
    green: '#0f7f85',
    grey: {
      9: color.GREY_9,
      '9-darken': darken(0.05, color.GREY_9),
    },
    inherit: 'inherit' as const,
    transparent: 'transparent' as const,
  }
}
