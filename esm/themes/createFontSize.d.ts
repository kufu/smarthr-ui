export declare const defaultHtmlFontSize = 16;
export interface FontSizeProperty {
    /** @deprecated */
    htmlFontSize?: number;
    /** @deprecated */
    SHORT?: number;
    /** @deprecated */
    TALL?: number;
    /** @deprecated */
    GRANDE?: number;
    /** @deprecated */
    VENTI?: number;
    scaleFactor?: number;
    XXS?: string;
    XS?: string;
    S?: string;
    M?: string;
    L?: string;
    XL?: string;
    XXL?: string;
}
export interface CreatedFontSizeTheme {
    /** @deprecated You shouldn't use rem except for font size. use calc. */
    pxToRem: (px: number) => string;
    /** @deprecated */
    SHORT: number;
    /** @deprecated */
    TALL: number;
    /** @deprecated */
    GRANDE: number;
    /** @deprecated */
    VENTI: number;
    XXS: string;
    XS: string;
    S: string;
    M: string;
    L: string;
    XL: string;
    XXL: string;
}
export type FontSizes = 'XXS' | 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
export declare const defaultFontSize: CreatedFontSizeTheme;
export declare const createFontSize: (userFontSize?: FontSizeProperty) => CreatedFontSizeTheme;
