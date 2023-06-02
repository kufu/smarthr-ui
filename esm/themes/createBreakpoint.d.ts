export interface BreakpointProperty {
    SP?: number;
    TABLET?: number;
}
export interface CreatedBreakpointTheme {
    SP: number;
    TABLET: number;
}
export declare const defaultBreakpoint: {
    SP: number;
    TABLET: number;
};
export declare const createBreakpoint: (userBreakpoint?: BreakpointProperty) => CreatedBreakpointTheme;
