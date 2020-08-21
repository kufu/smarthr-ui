import { FC, ReactNode } from 'react';
declare type Props = {
    id: string;
    parentRect: DOMRect;
    children: ReactNode;
    isIcon?: boolean;
    isMultiLine?: boolean;
    horizontal: 'left' | 'center' | 'right';
    vertical: 'top' | 'middle' | 'bottom';
};
export declare const TooltipPortal: FC<Props>;
export {};
