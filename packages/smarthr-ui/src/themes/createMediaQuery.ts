export type MediaQueryProperty = {
  SCREEN_SMALL?: string
  SCREEN_INFINITY?: string
  COLOR_MODE_FORCED?: string
  COLOR_SCHEME_LIGHT?: string
  COLOR_SCHEME_DARK?: string
  MOTION_REDUCED?: string
}

export type CreatedMediaQueryTheme = {
  SCREEN_SMALL: string
  SCREEN_INFINITY: string
  COLOR_MODE_FORCED: string
  COLOR_SCHEME_LIGHT: string
  COLOR_SCHEME_DARK: string
  MOTION_REDUCED: string
}

export const defaultMediaQuery: CreatedMediaQueryTheme = {
  SCREEN_SMALL: '(width <= 751px)',
  SCREEN_INFINITY: '(width <= 100vw)',
  COLOR_MODE_FORCED: '(forced-colors: active)',
  COLOR_SCHEME_LIGHT: '(prefers-color-scheme: light)',
  COLOR_SCHEME_DARK: '(prefers-color-scheme: dark)',
  MOTION_REDUCED: '(prefers-reduced-motion: reduce)',
}

export const createMediaQuery = (userMediaQuery: MediaQueryProperty = {}) => ({
  ...defaultMediaQuery,
  ...userMediaQuery,
})
