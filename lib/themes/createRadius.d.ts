export interface RadiusProperty {
    s?: string;
    m?: string;
    l?: string;
    full?: string;
}
export interface CreatedRadiusTheme {
    s: string;
    m: string;
    l: string;
    full: string;
}
export declare const defaultRadius: CreatedRadiusTheme;
export declare const createRadius: (userRadius?: RadiusProperty) => CreatedRadiusTheme;
