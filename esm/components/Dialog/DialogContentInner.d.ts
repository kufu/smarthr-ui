import { FC, ReactNode } from 'react';
declare type Props = {
    onClickOverlay?: () => void;
    onPressEscape?: () => void;
    isOpen: boolean;
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
    children: ReactNode;
};
export declare const DialogContentInner: FC<Props>;
export {};
