import React from 'react';
declare type Props = {
    children: React.ReactNode;
    iconPosition?: 'left' | 'right';
    displayIcon?: boolean;
    expandableMultiply?: boolean;
    defaultExpanded?: string[];
    className?: string;
    onClick?: (expandedItems: string[]) => void;
};
export declare const AccordionPanelContext: React.Context<{
    iconPosition: 'left' | 'right';
    displayIcon: boolean;
    expandedItems: Map<string, string>;
    expandableMultiply: boolean;
    onClickTrigger?: ((itemName: string, isExpanded: boolean) => void) | undefined;
    onClickProps?: ((expandedItems: string[]) => void) | undefined;
}>;
export declare const AccordionPanel: React.FC<Props>;
export {};
