export interface SizeProperty {
    htmlFontSize?: number;
    space?: {
        defaultRem?: number;
        XXS?: number;
        XS?: number;
        S?: number;
        M?: number;
        L?: number;
        XL?: number;
        XXL?: number;
    };
    font?: {
        SHORT?: number;
        TALL?: number;
        GRANDE?: number;
        VENTI?: number;
    };
    mediaQuery?: {
        SP?: number;
        TABLET?: number;
    };
}
export interface CreatedSizeTheme {
    pxToRem: (value: number) => string;
    space: {
        XXS: number;
        XS: number;
        S: number;
        M: number;
        L: number;
        XL: number;
        XXL: number;
    };
    font: {
        SHORT: number;
        TALL: number;
        GRANDE: number;
        VENTI: number;
    };
    mediaQuery: {
        SP: number;
        TABLET: number;
    };
}
/**
 * @deprecated The defaultSize will be deprecated, please use defaultFontSize, defaultSpacing or defaultBreakPoint instead
 */
export declare const defaultSize: CreatedSizeTheme;
export declare const createSize: (userSize?: SizeProperty) => CreatedSizeTheme;
