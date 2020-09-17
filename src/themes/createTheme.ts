import { CreatedFrameTheme, FrameProperty, createFrame } from './createFrame'
import {
  CreatedInteractionTheme,
  InteractionProperty,
  createInteraction,
} from './createInteraction'
import { CreatedPaletteTheme, PaletteProperty, createPalette } from './createPalette'
import { CreatedSizeTheme, SizeProperty, createSize } from './createSize'
import { CreatedShadowTheme, ShadowProperty, createShadow } from './createShadow'

interface ThemeProperty {
  palette?: PaletteProperty
  size?: SizeProperty
  frame?: FrameProperty
  interaction?: InteractionProperty
  shadow?: ShadowProperty
}

export interface CreatedTheme {
  palette: CreatedPaletteTheme
  size: CreatedSizeTheme
  frame: CreatedFrameTheme
  interaction: CreatedInteractionTheme
  shadow: CreatedShadowTheme
}

export const createTheme = (theme: ThemeProperty = {}) => {
  const created: CreatedTheme = {
    palette: createPalette(theme.palette || {}),
    size: createSize(theme.size || {}),
    frame: createFrame(theme.frame || {}, theme.palette || {}),
    interaction: createInteraction(theme.interaction || {}),
    shadow: createShadow(theme.shadow || {}),
  }
  return created
}
