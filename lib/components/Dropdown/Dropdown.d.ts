import React, { MutableRefObject, ReactNode, VFC } from 'react';
import { Rect } from './dropdownHelper';
type Props = {
    children: ReactNode;
};
type DropdownContextType = {
    active: boolean;
    triggerRect: Rect;
    triggerElementRef: MutableRefObject<HTMLDivElement | null>;
    rootTriggerRef: MutableRefObject<HTMLDivElement | null> | null;
    onClickTrigger: (rect: Rect) => void;
    onClickCloser: () => void;
    DropdownContentRoot: VFC<{
        children: ReactNode;
    }>;
    contentId: string;
};
export declare const DropdownContext: React.Context<DropdownContextType>;
export declare const Dropdown: VFC<Props>;
export {};
