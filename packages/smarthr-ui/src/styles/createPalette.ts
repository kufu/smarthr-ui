export interface CreatedPaletteTheme {
  primaryLight: string
  primaryDark: string
  white: string
  black: string
  success: {
    primary: string
    secondary: string
  }
  info: {
    primary: string
    secondary: string
  }
  warning: {
    primary: string
    secondary: string
  }
  danger: {
    primary: string
    secondary: string
  }
}

export const createPalette = (palette: any = {}) => {
  const created: CreatedPaletteTheme = {
    primaryLight: '#32ece0',
    primaryDark: '#27b8dd',
    white: '#fff',
    black: '#222',
    success: {
      primary: '#c9e2b3',
      secondary: '#3c763d',
    },
    info: {
      primary: '#b3e5ef',
      secondary: '#31708f',
    },
    warning: {
      primary: '#faebcc',
      secondary: '#8a6d3b',
    },
    danger: {
      primary: '#ebccd1',
      secondary: '#a94442',
    },
    ...palette,
  }

  return created
}
