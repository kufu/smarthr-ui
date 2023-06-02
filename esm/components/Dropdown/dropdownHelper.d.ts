import { RefObject } from 'react';
export type Rect = {
    top: number;
    right: number;
    bottom: number;
    left: number;
};
type Size = {
    width: number;
    height: number;
};
export type ContentBoxStyle = {
    top: string;
    left?: string;
    right?: string;
    maxHeight: string;
};
export declare function isEventFromChild(e: Event, parent: Element | null): boolean;
export declare function getContentBoxStyle(triggerRect: Rect, contentSize: Size, windowSize: Size, scroll: {
    top: number;
    left: number;
}): ContentBoxStyle;
export declare function getFirstTabbable(ref: RefObject<HTMLElement>): HTMLElement | null;
export {};
