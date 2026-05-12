import { darken } from 'polished'

import { merge } from '../libs/lodash'

import { type ColorProperty, defaultColor } from './createColor'

export type CreatedBackgroundColorTheme = {
  black: string
  white: string
  'white-darken': string
  background: string
  border: string
  brand: string
  column: string
  'column-darken': string
  'base-grey': string
  'over-background': string
  head: string
  'head-darken': string
  'action-background': string
  main: string
  'main-darken': string
  danger: string
  'danger-darken': string
  'warning-yellow': string
  'warning-yellow-darken': string
  overlay: string
  scrim: string
  green: string
  grey: {
    9: string
    '9-darken': string
  }
  inherit: 'inherit'
  transparent: 'transparent'
}

export const defaultBackgroundColor: CreatedBackgroundColorTheme = {
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
