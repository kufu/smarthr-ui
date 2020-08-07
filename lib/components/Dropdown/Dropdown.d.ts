import React, { FC, MutableRefObject, ReactNode } from 'react';
import { Rect } from './dropdownHelper';
declare type Props = {
    children: ReactNode;
};
declare type DropdownContextType = {
    active: boolean;
    triggerRect: Rect;
    triggerElementRef: MutableRefObject<HTMLDivElement | null>;
    onClickTrigger: (rect: Rect) => void;
    onClickCloser: () => void;
    DropdownContentRoot: FC<{
        children: ReactNode;
    }>;
};
export declare const DropdownContext: React.Context<DropdownContextType>;
export declare const Dropdown: FC<Props>;
export {};
