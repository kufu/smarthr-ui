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
import {
  CreatedSpacingByCharTheme,
  CreatedSpacingTheme,
  SpacingProperty,
  createSpacing,
  createSpacingByChar,
} from './createSpacing'
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
  spacingByChar: CreatedSpacingByCharTheme
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
  const paletteProperty = getPaletteProperty(theme)
  const colorProperty = getColorProperty(theme)
  const baseSize = getSpacingProperty(theme).baseSize
  const created: CreatedTheme = {
    palette: createPalette(paletteProperty),
    color: createColor(colorProperty),
    size: createSize(getSizeProperty(theme)),
    fontSize: createFontSize(getFontSizeProperty(theme)),
    spacing: createSpacing(baseSize),
    spacingByChar: createSpacingByChar(baseSize),
    breakpoint: createBreakpoint(getBreakpointProperty(theme)),
    frame: createFrame(getFrameProperty(theme), paletteProperty),
    border: createBorder(getBorderProperty(theme), colorProperty),
    radius: createRadius(getRadiusProperty(theme)),
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
    htmlFontSize: theme.fontSize?.htmlFontSize || theme.size?.htmlFontSize,
    space: {
      defaultRem: theme.size?.space?.defaultRem,
      XXS: theme.size?.space?.XXS,
      XS: theme.size?.space?.XS,
      S: theme.size?.space?.S,
      M: theme.size?.space?.M,
      L: theme.size?.space?.L,
      XL: theme.size?.space?.XL,
      XXL: theme.size?.space?.XXL,
    },
    font: {
      SHORT: theme.fontSize?.SHORT || theme.size?.font?.SHORT,
      TALL: theme.fontSize?.TALL || theme.size?.font?.TALL,
      GRANDE: theme.fontSize?.GRANDE || theme.size?.font?.GRANDE,
      VENTI: theme.fontSize?.VENTI || theme.size?.font?.VENTI,
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
    baseSize: theme.spacing?.baseSize,
  }
}
function getBreakpointProperty(theme: ThemeProperty): BreakpointProperty {
  return {
    ...theme.size?.mediaQuery,
    ...theme.breakpoint,
  }
}
function getFrameProperty(theme: ThemeProperty): FrameProperty {
  return {
    border: {
      lineWidth: theme.border?.lineWidth || theme.frame?.border?.lineWidth,
      lineStyle: theme.border?.lineStyle || theme.frame?.border?.lineStyle,
      default: theme.border?.shorthand || theme.frame?.border?.default,
      radius: {
        ...theme.frame?.border?.radius,
        ...theme.radius,
      },
    },
  }
}
function getBorderProperty(theme: ThemeProperty): BorderProperty {
  return {
    lineWidth: theme.border?.lineWidth || theme.frame?.border?.lineWidth,
    lineStyle: theme.border?.lineStyle || theme.frame?.border?.lineStyle,
    shorthand: theme.border?.shorthand || theme.frame?.border?.default,
  }
}
function getRadiusProperty(theme: ThemeProperty): RadiusProperty {
  return {
    ...theme.frame?.border?.radius,
    ...theme.radius,
  }
}
