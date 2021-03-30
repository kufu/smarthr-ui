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
import { CreatedSpacingTheme, SpacingProperty, createSpacing } from './createSpacing'
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
  spacing: CreatedSpacingTheme
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
}

export const createTheme = (theme: ThemeProperty = {}) => {
  const created: CreatedTheme = {
    palette: createPalette(getPaletteProperty(theme)),
    color: createColor(getColorProperty(theme)),
    size: createSize(getSizeProperty(theme)),
    fontSize: createFontSize(getFontSizeProperty(theme)),
    spacing: createSpacing(getSpacingProperty(theme)),
    breakpoint: createBreakpoint(getBreakpointProperty(theme)),
    frame: createFrame(theme.frame, theme.palette),
    border: createBorder(theme.border, theme.color),
    radius: createRadius(theme.radius),
    interaction: createInteraction(theme.interaction),
    shadow: createShadow(theme.shadow),
    zIndex: createZIndex(theme.zIndex),
  }
  return created
}

function getPaletteProperty(theme: ThemeProperty): PaletteProperty {
  return {
    ...theme.palette,
    ...theme.color,
  }
}
function getColorProperty(theme: ThemeProperty): ColorProperty {
  return {
    ...theme.palette,
    ...theme.color,
  }
}
function getSizeProperty(theme: ThemeProperty): SizeProperty {
  return {
    htmlFontSize: theme.size?.htmlFontSize || theme.fontSize?.htmlFontSize,
    space: {
      defaultRem: theme.size?.space?.defaultRem || theme.spacing?.baseSize,
      XXS: theme.size?.space?.XXS || theme.spacing?.XXS,
      XS: theme.size?.space?.XS || theme.spacing?.XS,
      S: theme.size?.space?.S || theme.spacing?.S,
      M: theme.size?.space?.M || theme.spacing?.M,
      L: theme.size?.space?.L || theme.spacing?.L,
      XL: theme.size?.space?.XL || theme.spacing?.XL,
      XXL: theme.size?.space?.XXL || theme.spacing?.XXL,
    },
    font: {
      SHORT: theme.size?.font?.SHORT || theme.fontSize?.SHORT,
      TALL: theme.size?.font?.TALL || theme.fontSize?.TALL,
      GRANDE: theme.size?.font?.GRANDE || theme.fontSize?.GRANDE,
      VENTI: theme.size?.font?.VENTI || theme.fontSize?.VENTI,
    },
    mediaQuery: {
      ...theme.size?.mediaQuery,
      ...theme.breakpoint,
    },
  }
}
function getFontSizeProperty(theme: ThemeProperty): FontSizeProperty {
  return {
    htmlFontSize: theme.size?.htmlFontSize,
    ...theme.size?.font,
    ...theme.fontSize,
  }
}
function getSpacingProperty(theme: ThemeProperty): SpacingProperty {
  return {
    baseSize: theme.size?.space?.defaultRem,
    XXS: theme.size?.space?.XXS,
    XS: theme.size?.space?.XS,
    S: theme.size?.space?.S,
    M: theme.size?.space?.M,
    L: theme.size?.space?.L,
    XL: theme.size?.space?.XL,
    XXL: theme.size?.space?.XXL,
    ...theme.spacing,
  }
}
function getBreakpointProperty(theme: ThemeProperty): BreakpointProperty {
  return {
    ...theme.size?.mediaQuery,
    ...theme.breakpoint,
  }
}
