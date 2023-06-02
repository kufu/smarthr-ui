export interface ZIndexProperty {
    AUTO?: 'auto';
    DEFAULT?: number;
    FIXED_MENU?: number;
    OVERLAP_BASE?: number;
    OVERLAP?: number;
    FLASH_MESSAGE?: number;
}
export interface CreatedZindexTheme {
    AUTO: 'auto';
    DEFAULT: number;
    FIXED_MENU: number;
    OVERLAP_BASE: number;
    OVERLAP: number;
    FLASH_MESSAGE: number;
}
export declare const defaultZIndex: {
    AUTO: string;
    DEFAULT: number;
    FIXED_MENU: number;
    OVERLAP_BASE: number;
    OVERLAP: number;
    FLASH_MESSAGE: number;
};
export declare const createZIndex: (userZIndex?: ZIndexProperty) => CreatedZindexTheme;
