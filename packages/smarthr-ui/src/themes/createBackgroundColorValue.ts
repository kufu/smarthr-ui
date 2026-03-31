import { darken } from 'polished'

import { merge } from '../libs/lodash'

import { type ColorProperty, defaultColor } from './createColor'

const semanticBackgroundColorTokens = {
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

export const defaultBackgroundColor = semanticBackgroundColorTokens

type BackgroundColorPalette = typeof defaultBackgroundColor
export type CreatedBackgroundColorValueTheme = BackgroundColorPalette

export const createBackgroundColorValue = (
  userColor?: ColorProperty,
): CreatedBackgroundColorValueTheme => {
  const backgroundColor = { ...defaultBackgroundColor }

  if (!userColor) {
    return backgroundColor
  }

  // userColorに基づいて対応するbackgroundColorを更新
  const overrides: Partial<BackgroundColorPalette> = {}

  if (userColor.MAIN) {
    overrides.main = userColor.MAIN
    overrides['main-darken'] = darken(0.05, userColor.MAIN)
  }
  if (userColor.WHITE) {
    overrides.white = userColor.WHITE
    overrides['white-darken'] = darken(0.05, userColor.WHITE)
  }
  if (userColor.GREY_100) {
    overrides.black = userColor.GREY_100
  }
  if (userColor.BACKGROUND) {
    overrides.background = userColor.BACKGROUND
  }
  if (userColor.GREY_20) {
    overrides.border = userColor.GREY_20
  }
  if (userColor.BRAND) {
    overrides.brand = userColor.BRAND
  }
  if (userColor.COLUMN) {
    overrides.column = userColor.COLUMN
    overrides['column-darken'] = darken(0.05, userColor.COLUMN)
  }
  if (userColor.BASE_GREY) {
    overrides['base-grey'] = userColor.BASE_GREY
  }
  if (userColor.OVER_BACKGROUND) {
    overrides['over-background'] = userColor.OVER_BACKGROUND
  }
  if (userColor.HEAD) {
    overrides.head = userColor.HEAD
    overrides['head-darken'] = darken(0.05, userColor.HEAD)
  }
  if (userColor.ACTION_BACKGROUND) {
    overrides['action-background'] = userColor.ACTION_BACKGROUND
  }
  if (userColor.DANGER) {
    overrides.danger = userColor.DANGER
    overrides['danger-darken'] = darken(0.05, userColor.DANGER)
  }
  if (userColor.WARNING_YELLOW) {
    overrides['warning-yellow'] = userColor.WARNING_YELLOW
    overrides['warning-yellow-darken'] = darken(0.05, userColor.WARNING_YELLOW)
  }
  if (userColor.OVERLAY) {
    overrides.overlay = userColor.OVERLAY
  }
  if (userColor.SCRIM) {
    overrides.scrim = userColor.SCRIM
  }
  if (userColor.GREY_9) {
    overrides.grey = {
      9: userColor.GREY_9,
      '9-darken': darken(0.05, userColor.GREY_9),
    }
  }

  return merge(backgroundColor, overrides)
}
