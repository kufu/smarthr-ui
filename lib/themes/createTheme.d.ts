import { BorderProperty, CreatedBorderTheme } from './createBorder';
import { BreakpointProperty, CreatedBreakpointTheme } from './createBreakpoint';
import { ColorProperty, CreatedColorTheme } from './createColor';
import { CreatedFontSizeTheme, FontSizeProperty } from './createFontSize';
import { CreatedFrameTheme, FrameProperty } from './createFrame';
import { CreatedInteractionTheme, InteractionProperty } from './createInteraction';
import { CreatedLeading, LeadingProperty } from './createLeading';
import { CreatedPaletteTheme, PaletteProperty } from './createPalette';
import { CreatedRadiusTheme, RadiusProperty } from './createRadius';
import { CreatedShadowTheme, ShadowProperty } from './createShadow';
import { CreatedSizeTheme, SizeProperty } from './createSize';
import { CreatedSpacingByCharTheme, CreatedSpacingTheme, SpacingProperty } from './createSpacing';
import { CreatedZindexTheme, ZIndexProperty } from './createZIndex';
interface ThemeProperty {
    /**
     * @deprecated The palette property will be deprecated, please use color property instead
     */
    palette?: PaletteProperty;
    color?: ColorProperty;
    /**
     * @deprecated The size property will be deprecated, please use fontSize, spacing or breakpoint property instead
     */
    size?: SizeProperty;
    fontSize?: FontSizeProperty;
    leading?: LeadingProperty;
    spacing?: SpacingProperty;
    breakpoint?: BreakpointProperty;
    /**
     * @deprecated The frame property will be deprecated, please use border or radius property instead
     */
    frame?: FrameProperty;
    border?: BorderProperty;
    radius?: RadiusProperty;
    interaction?: InteractionProperty;
    shadow?: ShadowProperty;
    zIndex?: ZIndexProperty;
}
export interface CreatedTheme {
    /**
     * @deprecated The palette property will be deprecated, please use color property instead
     */
    palette: CreatedPaletteTheme;
    color: CreatedColorTheme;
    /**
     * @deprecated The size property will be deprecated, please use fontSize, spacing or breakpoint property instead
     */
    size: CreatedSizeTheme;
    fontSize: CreatedFontSizeTheme;
    leading: CreatedLeading;
    spacing: CreatedSpacingTheme;
    spacingByChar: CreatedSpacingByCharTheme;
    space: CreatedSpacingByCharTheme;
    breakpoint: CreatedBreakpointTheme;
    /**
     * @deprecated The frame property will be deprecated, please use border or radius property instead
     */
    frame: CreatedFrameTheme;
    border: CreatedBorderTheme;
    radius: CreatedRadiusTheme;
    interaction: CreatedInteractionTheme;
    shadow: CreatedShadowTheme;
    zIndex: CreatedZindexTheme;
}
export declare const createTheme: (theme?: ThemeProperty) => CreatedTheme;
export {};
