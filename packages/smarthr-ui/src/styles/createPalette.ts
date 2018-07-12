export interface CreatedPaletteTheme {
  primary: string
  white: string
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
    primary: '#4ed0d6',
    white: '#fff',
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
