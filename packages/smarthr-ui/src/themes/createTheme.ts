import { BorderProperty, CreatedBorderTheme, createBorder } from './createBorder'
import { BreakpointProperty, CreatedBreakpointTheme, createBreakpoint } from './createBreakpoint'
import { ColorProperty, CreatedColorTheme, createColor } from './createColor'
import { CreatedFontSizeTheme, FontSizeProperty, createFontSize } from './createFontSize'
import { CreatedFrameTheme, FrameProperty, createFrame } from './createFrame'
import {
  CreatedInteractionTheme,
  InteractionProperty,
  createInteraction,
} from './createInteraction'
import { CreatedLeading, LeadingProperty, createLeading } from './createLeading'
import { CreatedPaletteTheme, PaletteProperty, createPalette } from './createPalette'
import { CreatedRadiusTheme, RadiusProperty, createRadius } from './createRadius'
import { CreatedShadowTheme, ShadowProperty, createShadow } from './createShadow'
import { CreatedSizeTheme, SizeProperty, createSize } from './createSize'
import {
  CreatedSpacingByCharTheme,
  CreatedSpacingTheme,
  SpacingProperty,
  createSpacing,
  createSpacingByChar,
} from './createSpacing'
import { CreatedZindexTheme, ZIndexProperty, createZIndex } from './createZIndex'

type ThemeProperty = {
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
  leading?: LeadingProperty
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

export type CreatedTheme = {
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
  leading: CreatedLeading
  spacing: CreatedSpacingTheme
  spacingByChar: CreatedSpacingByCharTheme
  space: CreatedSpacingByCharTheme
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

export const createTheme = (theme: ThemeProperty = {}): CreatedTheme => {
  const paletteProperty = getPaletteProperty(theme)
  const colorProperty = getColorProperty(theme)
  const baseSize = getSpacingProperty(theme).baseSize
  const spacingByChar = createSpacingByChar(baseSize)

  return {
    palette: createPalette(paletteProperty),
    color: createColor(colorProperty),
    size: createSize(getSizeProperty(theme)),
    fontSize: createFontSize(getFontSizeProperty(theme)),
    spacing: createSpacing(baseSize),
    spacingByChar,
    space: spacingByChar,
    leading: createLeading(getLeadingProperty(theme)),
    breakpoint: createBreakpoint(getBreakpointProperty(theme)),
    frame: createFrame(getFrameProperty(theme), paletteProperty),
    border: createBorder(getBorderProperty(theme), colorProperty),
    radius: createRadius(getRadiusProperty(theme)),
    interaction: createInteraction(theme.interaction),
    shadow: createShadow(theme.shadow, colorProperty),
    zIndex: createZIndex(theme.zIndex),
  }
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
  const fontSize = theme.fontSize || {}
  const size = theme.size || {}
  const space = size.space || {}
  const font = size.font || {}

  return {
    htmlFontSize: fontSize.htmlFontSize || size.htmlFontSize,
    space: {
      defaultRem: space.defaultRem,
      XXS: space.XXS,
      XS: space.XS,
      S: space.S,
      M: space.M,
      L: space.L,
      XL: space.XL,
      XXL: space.XXL,
    },
    font: {
      SHORT: fontSize.SHORT || font.SHORT,
      TALL: fontSize.TALL || font.TALL,
      GRANDE: fontSize.GRANDE || font.GRANDE,
      VENTI: fontSize.VENTI || font.VENTI,
    },
    mediaQuery: {
      ...size.mediaQuery,
      ...theme.breakpoint,
    },
  }
}
function getFontSizeProperty(theme: ThemeProperty): FontSizeProperty {
  const size = theme.size || {}

  return {
    htmlFontSize: size.htmlFontSize,
    ...size.font,
    ...theme.fontSize,
  }
}
const getLeadingProperty = (theme: ThemeProperty): LeadingProperty => ({ ...theme.leading })
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
  const border = theme.border || {}
  const frameBorder = theme.frame?.border || {}

  return {
    border: {
      lineWidth: border.lineWidth || frameBorder.lineWidth,
      lineStyle: border.lineStyle || frameBorder.lineStyle,
      default: border.shorthand || frameBorder.default,
      radius: {
        ...frameBorder.radius,
        ...theme.radius,
      },
    },
  }
}
function getBorderProperty(theme: ThemeProperty): BorderProperty {
  const border = theme.border || {}
  const frameBorder = theme.frame?.border || {}

  return {
    lineWidth: border.lineWidth || frameBorder.lineWidth,
    lineStyle: border.lineStyle || frameBorder.lineStyle,
    shorthand: border.shorthand || frameBorder.default,
  }
}
function getRadiusProperty(theme: ThemeProperty): RadiusProperty {
  return {
    ...theme.frame?.border?.radius,
    ...theme.radius,
  }
}
