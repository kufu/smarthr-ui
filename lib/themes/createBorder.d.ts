import { ColorProperty } from './createColor';
export interface BorderProperty {
    lineWidth?: string;
    lineStyle?: string;
    shorthand?: string;
}
export interface CreatedBorderTheme {
    lineWidth: string;
    lineStyle: string;
    shorthand: string;
    highContrast: string;
}
export declare const defaultBorder: CreatedBorderTheme;
export declare const createBorder: (userBorder?: BorderProperty, userColor?: ColorProperty) => CreatedBorderTheme;
