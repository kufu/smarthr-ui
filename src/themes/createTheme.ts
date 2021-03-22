import { CreatedFrameTheme, FrameProperty, createFrame } from './createFrame'
import { BorderProperty, CreatedBorderTheme, createBorder } from './createBorder'
import { CreatedRadiusTheme, RadiusProperty, createRadius } from './createRadius'
import {
  CreatedInteractionTheme,
  InteractionProperty,
  createInteraction,
} from './createInteraction'
import { CreatedPaletteTheme, PaletteProperty, createPalette } from './createPalette'
import { ColorProperty, CreatedColorTheme, createColor } from './createColor'
import { CreatedSizeTheme, SizeProperty, createSize } from './createSize'
import { CreatedFontSizeTheme, FontSizeProperty, createFontSize } from './createFontSize'
import { RemSizeProperty, createRemSize, createRemSizeForPxToRem } from './createRemSize'
import { CreatedSpacingTheme, SpacingProperty, createSpacing } from './createSpacing'
import { space } from './createSpace'
import { BreakpointProperty, CreatedBreakpointTheme, createBreakpoint } from './createBreakpoint'
import { CreatedShadowTheme, ShadowProperty, createShadow } from './createShadow'
import { CreatedZindexTheme, ZIndexProperty, createZIndex } from './createZIndex'

interface ThemeProperty {
  /**
   * @deprecated The palette property will be deprecated, please use color property instead
   */
  palette?: PaletteProperty
  color?: ColorProperty
  /**
   * @deprecated The size property will be deprecated, please use fontSize, spacing or breakpoint property instead
   */
  size?: SizeProperty
  fontSize?: FontSizeProperty
  fontSizeFactor?: number
  spacing?: SpacingProperty
  breakpoint?: BreakpointProperty
  /**
   * @deprecated The frame property will be deprecated, please use border or radius property instead
   */
  frame?: FrameProperty
  border?: BorderProperty
  radius?: RadiusProperty
  interaction?: InteractionProperty
  shadow?: ShadowProperty
  zIndex?: ZIndexProperty
  shinTheme?: boolean
}

export interface CreatedTheme {
  /**
   * @deprecated The palette property will be deprecated, please use color property instead
   */
  palette: CreatedPaletteTheme
  color: CreatedColorTheme
  /**
   * @deprecated The size property will be deprecated, please use fontSize, spacing or breakpoint property instead
   */
  size: CreatedSizeTheme
  fontSize: CreatedFontSizeTheme
  remSize: RemSizeProperty
  remSizeForPxToRem: RemSizeProperty
  spacing: CreatedSpacingTheme
  space: typeof space
  breakpoint: CreatedBreakpointTheme
  /**
   * @deprecated The frame property will be deprecated, please use border or radius property instead
   */
  frame: CreatedFrameTheme
  border: CreatedBorderTheme
  radius: CreatedRadiusTheme
  interaction: CreatedInteractionTheme
  shadow: CreatedShadowTheme
  zIndex: CreatedZindexTheme
  shinTheme: boolean
}

export const createTheme = (theme: ThemeProperty = {}) => {
  const created: CreatedTheme = {
    palette: createPalette(theme.palette),
    color: createColor(theme.color),
    size: createSize(theme.size),
    fontSize: createFontSize(theme.fontSize),
    remSize: createRemSize(theme.fontSizeFactor),
    remSizeForPxToRem: createRemSizeForPxToRem(theme.fontSizeFactor),
    spacing: createSpacing(theme.spacing),
    space,
    breakpoint: createBreakpoint(theme.breakpoint),
    frame: createFrame(theme.frame, theme.palette),
    border: createBorder(theme.border, theme.color),
    radius: createRadius(theme.radius),
    interaction: createInteraction(theme.interaction),
    shadow: createShadow(theme.shadow),
    zIndex: createZIndex(theme.zIndex),
    shinTheme: !!theme.shinTheme,
  }
  return created
}
