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
export declare const defaultFrame: CreatedFrameTheme;
export declare const createFrame: (userFrame?: FrameProperty, userPalette?: PaletteProperty) => CreatedFrameTheme;
