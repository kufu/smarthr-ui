import { type BorderProperty, type CreatedBorderTheme, createBorder } from './createBorder'
import {
  type BreakpointProperty,
  type CreatedBreakpointTheme,
  createBreakpoint,
} from './createBreakpoint'
import { type ColorProperty, type CreatedColorTheme, createColor } from './createColor'
import { type CreatedFontSizeTheme, type FontSizeProperty, createFontSize } from './createFontSize'
import {
  type CreatedInteractionTheme,
  type InteractionProperty,
  createInteraction,
} from './createInteraction'
import { type CreatedLeading, type LeadingProperty, createLeading } from './createLeading'
import { type CreatedRadiusTheme, type RadiusProperty, createRadius } from './createRadius'
import { type CreatedShadowTheme, type ShadowProperty, createShadow } from './createShadow'
import { type CreatedSizeTheme, type SizeProperty, createSize } from './createSize'
import {
  type CreatedSpacingByCharTheme,
  type CreatedSpacingTheme,
  type SpacingProperty,
  createSpacing,
  createSpacingByChar,
} from './createSpacing'
import { type CreatedZindexTheme, type ZIndexProperty, createZIndex } from './createZIndex'

type ThemeProperty = {
  color?: ColorProperty
  /**
   * @deprecated The size property will be deprecated, please use fontSize, spacing or breakpoint property instead
   */
  size?: SizeProperty
  fontSize?: FontSizeProperty
  leading?: LeadingProperty
  spacing?: SpacingProperty
  breakpoint?: BreakpointProperty
  border?: BorderProperty
  radius?: RadiusProperty
  interaction?: InteractionProperty
  shadow?: ShadowProperty
  zIndex?: ZIndexProperty
}

export type CreatedTheme = {
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
  border: CreatedBorderTheme
  radius: CreatedRadiusTheme
  interaction: CreatedInteractionTheme
  shadow: CreatedShadowTheme
  zIndex: CreatedZindexTheme
}

export const createTheme = (theme: ThemeProperty = {}): CreatedTheme => {
  const colorProperty = getColorProperty(theme)
  const baseSize = getSpacingProperty(theme).baseSize
  const spacingByChar = createSpacingByChar(baseSize)

  return {
    color: createColor(colorProperty),
    size: createSize(getSizeProperty(theme)),
    fontSize: createFontSize(getFontSizeProperty(theme)),
    spacing: createSpacing(baseSize),
    spacingByChar,
    space: spacingByChar,
    leading: createLeading(getLeadingProperty(theme)),
    breakpoint: createBreakpoint(getBreakpointProperty(theme)),
    border: createBorder(getBorderProperty(theme), colorProperty),
    radius: createRadius(getRadiusProperty(theme)),
    interaction: createInteraction(theme.interaction),
    shadow: createShadow(theme.shadow, colorProperty),
    zIndex: createZIndex(theme.zIndex),
  }
}

function getColorProperty(theme: ThemeProperty): ColorProperty {
  return theme.color || {}
}
function getSizeProperty(theme: ThemeProperty): SizeProperty {
  return {
    space: theme.size?.space || {},
    mediaQuery: {
      ...theme.size?.mediaQuery,
      ...theme.breakpoint,
    },
  }
}
function getFontSizeProperty(theme: ThemeProperty): FontSizeProperty {
  return theme.fontSize || {}
}
function getLeadingProperty(theme: ThemeProperty): LeadingProperty {
  return theme.leading || {}
}
function getSpacingProperty(theme: ThemeProperty): SpacingProperty {
  return theme.spacing || {}
}
function getBreakpointProperty(theme: ThemeProperty): BreakpointProperty {
  return {
    ...theme.size?.mediaQuery,
    ...theme.breakpoint,
  }
}
function getBorderProperty(theme: ThemeProperty): BorderProperty {
  return theme.border || {}
}
function getRadiusProperty(theme: ThemeProperty): RadiusProperty {
  return theme.radius || {}
}
