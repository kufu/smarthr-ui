import React from 'react';
export declare const DropdownContentContext: React.Context<{
    onClickCloser: () => void;
    controllable: boolean;
    scrollable: boolean;
}>;
declare type Props = {
    controllable?: boolean;
    scrollable?: boolean;
    className?: string;
};
export declare const DropdownContent: React.FC<Props>;
export {};
