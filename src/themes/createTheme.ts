import { PaletteProperty, CreatedPaletteTheme, createPalette } from './createPalette'
import { SizeProperty, CreatedSizeTheme, createSize } from './createSize'

interface ThemeProperty {
  palette?: PaletteProperty
  size?: SizeProperty
}

export interface CreatedTheme {
  palette: CreatedPaletteTheme
  size: CreatedSizeTheme
}

export const createTheme = (theme: ThemeProperty = {}) => {
  const created: CreatedTheme = {
    palette: createPalette(theme.palette || {}),
    size: createSize(theme.size || {}),
  }
  return created
}
