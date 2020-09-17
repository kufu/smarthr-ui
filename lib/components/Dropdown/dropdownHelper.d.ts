export declare type Rect = {
    top: number;
    right: number;
    bottom: number;
    left: number;
};
export declare function hasParentElement(element: HTMLElement | null, parent: HTMLElement | null): boolean;
declare type Size = {
    width: number;
    height: number;
};
export declare type ContentBoxStyle = {
    top: string;
    left: string;
    maxHeight: string;
};
export declare function getContentBoxStyle(triggerRect: Rect, contentSize: Size, windowSize: Size, scroll: {
    top: number;
    left: number;
}): ContentBoxStyle;
export {};
