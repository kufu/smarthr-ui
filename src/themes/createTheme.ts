import { CreatedFrameTheme, FrameProperty, createFrame } from './createFrame'
import {
  CreatedInteractionTheme,
  InteractionProperty,
  createInteraction,
} from './createInteraction'
import { CreatedPaletteTheme, PaletteProperty, createPalette } from './createPalette'
import { CreatedSizeTheme, SizeProperty, createSize } from './createSize'
import { CreatedZindexTheme, ZIndexProperty, createZIndex } from './createZIndex'

interface ThemeProperty {
  palette?: PaletteProperty
  size?: SizeProperty
  frame?: FrameProperty
  interaction?: InteractionProperty
  zIndex?: ZIndexProperty
}

export interface CreatedTheme {
  palette: CreatedPaletteTheme
  size: CreatedSizeTheme
  frame: CreatedFrameTheme
  interaction: CreatedInteractionTheme
  zIndex: CreatedZindexTheme
}

export const createTheme = (theme: ThemeProperty = {}) => {
  const created: CreatedTheme = {
    palette: createPalette(theme.palette || {}),
    size: createSize(theme.size || {}),
    frame: createFrame(theme.frame || {}, theme.palette || {}),
    interaction: createInteraction(theme.interaction || {}),
    zIndex: createZIndex(theme.zIndex || {}),
  }
  return created
}
