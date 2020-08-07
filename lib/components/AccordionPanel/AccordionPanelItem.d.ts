import React, { FC } from 'react';
declare type Props = {
    name: string;
    children: React.ReactNode;
    className?: string;
};
export declare const AccordionPanelItemContext: React.Context<{
    name: string;
}>;
export declare const AccordionPanelItem: FC<Props>;
export {};
