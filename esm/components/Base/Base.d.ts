import React, { ReactNode } from 'react';
declare type Props = {
    children: ReactNode;
    radius?: 's' | 'm';
    className?: string;
};
export declare const Base: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLDivElement>>;
export {};
