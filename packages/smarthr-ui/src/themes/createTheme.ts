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
import { type CreatedOutlineTheme, createOutline } from './createOutline'
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
  color?: ColorProperty
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
  outline: CreatedOutlineTheme
  zIndex: CreatedZindexTheme
}

export const createTheme = (theme: ThemeProperty = {}): CreatedTheme => {
  const colorProperty = theme.color
  const baseSize = theme.spacing?.baseSize
  const spacingByChar = createSpacingByChar(baseSize)

  return {
    color: createColor(colorProperty),
    fontSize: createFontSize(theme.fontSize),
    spacing: createSpacing(baseSize),
    spacingByChar,
    space: spacingByChar,
    leading: createLeading(theme.leading),
    breakpoint: createBreakpoint(theme.breakpoint),
    border: createBorder(theme.border, colorProperty),
    radius: createRadius(theme.radius),
    interaction: createInteraction(theme.interaction),
    shadow: createShadow(theme.shadow),
    outline: createOutline(colorProperty),
    zIndex: createZIndex(theme.zIndex),
  }
}
