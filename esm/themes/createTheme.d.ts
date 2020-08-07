import { CreatedFrameTheme, FrameProperty } from './createFrame';
import { CreatedInteractionTheme, InteractionProperty } from './createInteraction';
import { CreatedPaletteTheme, PaletteProperty } from './createPalette';
import { CreatedSizeTheme, SizeProperty } from './createSize';
interface ThemeProperty {
    palette?: PaletteProperty;
    size?: SizeProperty;
    frame?: FrameProperty;
    interaction?: InteractionProperty;
}
export interface CreatedTheme {
    palette: CreatedPaletteTheme;
    size: CreatedSizeTheme;
    frame: CreatedFrameTheme;
    interaction: CreatedInteractionTheme;
}
export declare const createTheme: (theme?: ThemeProperty) => CreatedTheme;
export {};
