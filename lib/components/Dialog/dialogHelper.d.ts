import { RefObject } from 'react';
declare type offsetHeightValues = {
    offsetHeight: number;
    titleRef: RefObject<HTMLParagraphElement>;
    bottomRef: RefObject<HTMLDivElement>;
};
export declare const useOffsetHeight: () => offsetHeightValues;
export {};
