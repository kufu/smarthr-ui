export declare const defaultBaseSize: number;
export interface SpacingProperty {
    baseSize?: number;
}
export interface CreatedSpacingTheme {
    X3S: string;
    XXS: string;
    XS: string;
    S: string;
    M: string;
    L: string;
    XL: string;
    XXL: string;
    X3L: string;
}
export type CreatedSpacingByCharTheme = (size: CharRelativeSize) => string;
declare const primitiveTokens: readonly [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 3.5, 4, 8, -0.25, -0.5, -0.75, -1, -1.25, -1.5, -2, -2.5, -3, -3.5, -4, -8];
export type CharRelativeSize = (typeof primitiveTokens)[number];
export type AbstractSize = keyof CreatedSpacingTheme;
export declare const createSpacing: (userBaseSize?: number) => {
    X3S: string;
    XXS: string;
    XS: string;
    S: string;
    M: string;
    L: string;
    XL: string;
    XXL: string;
    X3L: string;
    NONE: string;
};
export declare const createSpacingByChar: (userBaseSize?: number) => (size: CharRelativeSize) => string;
export declare const defaultSpacing: {
    X3S: string;
    XXS: string;
    XS: string;
    S: string;
    M: string;
    L: string;
    XL: string;
    XXL: string;
    X3L: string;
    NONE: string;
};
export {};
