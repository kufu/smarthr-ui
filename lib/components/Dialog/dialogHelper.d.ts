import { RefObject } from 'react';
type offsetHeightValues = {
    offsetHeight: number;
    titleRef: RefObject<HTMLParagraphElement>;
    bottomRef: RefObject<HTMLDivElement>;
};
export declare const useOffsetHeight: () => offsetHeightValues;
export {};
