interface Leading {
    NONE: number;
    TIGHT: number;
    NORMAL: number;
    RELAXED: number;
}
export type LeadingProperty = Partial<Omit<Leading, 'NONE'>>;
export type CreatedLeading = Leading;
export type Leadings = keyof Leading;
export declare const defaultLeading: CreatedLeading;
export declare const createLeading: (userLeading?: LeadingProperty) => Leading;
export {};
