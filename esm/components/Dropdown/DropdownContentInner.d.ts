import React, { FC } from 'react';
import { Rect } from './dropdownHelper';
declare type Props = {
    triggerRect: Rect;
    scrollable: boolean;
    children: React.ReactNode;
    className: string;
    controllable: boolean;
};
declare type DropdownContentInnerContextType = {
    maxHeight: string;
};
export declare const DropdownContentInnerContext: React.Context<DropdownContentInnerContextType>;
export declare const DropdownContentInner: FC<Props>;
export {};
