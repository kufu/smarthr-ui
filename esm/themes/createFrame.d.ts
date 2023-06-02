import { PaletteProperty } from './createPalette';
export interface FrameProperty {
    border?: {
        lineWidth?: string;
        lineStyle?: string;
        default?: string;
        radius?: {
            s?: string;
            m?: string;
            l?: string;
        };
    };
}
export interface CreatedFrameTheme {
    border: {
        lineWidth: string;
        lineStyle: string;
        default: string;
        radius: {
            s: string;
            m: string;
        };
    };
}
/**
 * @deprecated The defaultFrame will be deprecated, please use defaultBorder or defaultRadius instead
 */
export declare const defaultFrame: CreatedFrameTheme;
export declare const createFrame: (userFrame?: FrameProperty, userPalette?: PaletteProperty) => CreatedFrameTheme;
