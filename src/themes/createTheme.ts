import { PaletteProperty, CreatedPaletteTheme, createPalette } from './createPalette'
import { SizeProperty, CreatedSizeTheme, createSize } from './createSize'
import { FrameProperty, CreatedFrameTheme, createFrame } from './createFrame'

interface ThemeProperty {
  palette?: PaletteProperty
  size?: SizeProperty
  frame?: FrameProperty
}

export interface CreatedTheme {
  palette: CreatedPaletteTheme
  size: CreatedSizeTheme
  frame: CreatedFrameTheme
}

export const createTheme = (theme: ThemeProperty = {}) => {
  const created: CreatedTheme = {
    palette: createPalette(theme.palette || {}),
    size: createSize(theme.size || {}),
    frame: createFrame(theme.frame || {}, theme.palette || {}),
  }
  return created
}
