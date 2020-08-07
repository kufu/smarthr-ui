import React from 'react';
declare type Props = {
    isOpen: boolean;
    onClickOverlay?: () => void;
    onPressEscape?: () => void;
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
};
export declare const Dialog: React.FC<Props>;
export {};
