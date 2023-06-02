import { FC, ReactNode } from 'react';
type Props = {
    message: ReactNode;
    id: string;
    isVisible: boolean;
    parentRect: DOMRect | null;
    isIcon?: boolean;
    isMultiLine?: boolean;
    horizontal: 'left' | 'center' | 'right' | 'auto';
    vertical: 'top' | 'middle' | 'bottom' | 'auto';
};
export declare const TooltipPortal: FC<Props>;
export {};
