export declare const getNewExpandedItems: (prevExpandedItems: Map<string, string>, itemName: string, isExpanded: boolean, expandableMultiply: boolean) => Map<string, string>;
export declare const keycodes: {
    SPACE: number;
    ENTER: number;
    HOME: number;
    END: number;
    UP: number;
    RIGHT: number;
    DOWN: number;
    LEFT: number;
};
export declare const getSiblingButtons: (parent: HTMLDivElement) => HTMLElement[];
export declare const focusFirstSibling: (parent: HTMLDivElement) => void;
export declare const focusLastSibling: (parent: HTMLDivElement) => void;
export declare const focusNextSibling: (item: HTMLElement, parent: HTMLDivElement) => void;
export declare const focusPreviousSibling: (item: HTMLElement, parent: HTMLDivElement) => void;
