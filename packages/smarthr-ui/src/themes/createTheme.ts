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
import {
  type CreatedMediaQueryTheme,
  type MediaQueryProperty,
  createMediaQuery,
} from './createMediaQuery'
import { type CreatedRadiusTheme, type RadiusProperty, createRadius } from './createRadius'
import { type CreatedShadowTheme, type ShadowProperty, createShadow } from './createShadow'
import {
  type CreatedSpacingByCharTheme,
  type CreatedSpacingTheme,
  type SpacingProperty,
  createSpacing,
  createSpacingByChar,
} from './createSpacing'
import { type CreatedZindexTheme, type ZIndexProperty, createZIndex } from './createZIndex'

type ThemeProperty = {
  border?: BorderProperty
  breakpoint?: BreakpointProperty
  color?: ColorProperty
  fontSize?: FontSizeProperty
  interaction?: InteractionProperty
  leading?: LeadingProperty
  mediaQuery?: MediaQueryProperty
  radius?: RadiusProperty
  shadow?: ShadowProperty
  spacing?: SpacingProperty
  zIndex?: ZIndexProperty
}

export type CreatedTheme = {
  border: CreatedBorderTheme
  breakpoint: CreatedBreakpointTheme
  color: CreatedColorTheme
  fontSize: CreatedFontSizeTheme
  interaction: CreatedInteractionTheme
  leading: CreatedLeading
  mediaQuery: CreatedMediaQueryTheme
  radius: CreatedRadiusTheme
  shadow: CreatedShadowTheme
  space: CreatedSpacingByCharTheme
  spacing: CreatedSpacingTheme
  spacingByChar: CreatedSpacingByCharTheme
  zIndex: CreatedZindexTheme
}

export const createTheme = (theme: ThemeProperty = {}): CreatedTheme => {
  const colorProperty = theme.color
  const baseSize = theme.spacing?.baseSize
  const spacingByChar = createSpacingByChar(baseSize)

  return {
    border: createBorder(theme.border, colorProperty),
    breakpoint: createBreakpoint(theme.breakpoint),
    color: createColor(colorProperty),
    fontSize: createFontSize(theme.fontSize),
    interaction: createInteraction(theme.interaction),
    leading: createLeading(theme.leading),
    mediaQuery: createMediaQuery(theme.mediaQuery),
    radius: createRadius(theme.radius),
    shadow: createShadow(theme.shadow, colorProperty),
    space: spacingByChar,
    spacing: createSpacing(baseSize),
    spacingByChar,
    zIndex: createZIndex(theme.zIndex),
  }
}
