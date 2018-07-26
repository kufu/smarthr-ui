import { PaletteProperty, CreatedPaletteTheme, createPalette } from './createPalette'
import { TypographyProperty, CreatedTypographyTheme, createTypography } from './createTypography'

interface Theme {
  palette?: PaletteProperty
  typography?: TypographyProperty
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
