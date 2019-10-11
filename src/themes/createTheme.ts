import { CreatedFrameTheme, createFrame, FrameProperty } from './createFrame'
import {
  CreatedInteractionTheme,
  createInteraction,
  InteractionProperty,
} from './createInteraction'
import { CreatedPaletteTheme, createPalette, PaletteProperty } from './createPalette'
import { CreatedSizeTheme, createSize, SizeProperty } from './createSize'

export interface ThemeProperty {
  palette?: PaletteProperty
  size?: SizeProperty
  frame?: FrameProperty
  interaction?: InteractionProperty
}

export interface CreatedTheme {
  palette: CreatedPaletteTheme
  size: CreatedSizeTheme
  frame: CreatedFrameTheme
  interaction: CreatedInteractionTheme
}

export const createTheme = (theme: ThemeProperty = {}) => {
  const created: CreatedTheme = {
    palette: createPalette(theme.palette || {}),
    size: createSize(theme.size || {}),
    frame: createFrame(theme.frame || {}, theme.palette || {}),
    interaction: createInteraction(theme.interaction || {}),
  }
  return created
}
