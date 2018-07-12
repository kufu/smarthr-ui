import { CreatedPaletteTheme, createPalette } from './createPalette'
import { CreatedTypographyTheme, createTypography } from './createTypography'

interface Theme {
  palette?: any
  typography?: any
}

export interface CreatedTheme {
  palette: CreatedPaletteTheme
  typography: CreatedTypographyTheme
}

export const createTheme = (theme: Theme = {}) => {
  const created: CreatedTheme = {
    palette: createPalette(theme.palette || {}),
    typography: createTypography(theme.typography || {}),
  }
  return created
}
