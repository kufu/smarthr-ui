import React, { FC, HTMLAttributes } from 'react';
import { Rect } from './dropdownHelper';
type Props = {
    triggerRect: Rect;
    scrollable: boolean;
    children: React.ReactNode;
    className: string;
    controllable: boolean;
};
export type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>;
type DropdownContentInnerContextType = {
    maxHeight: string;
};
export declare const DropdownContentInnerContext: React.Context<DropdownContentInnerContextType>;
export declare const DropdownContentInner: FC<Props & ElementProps>;
export {};
