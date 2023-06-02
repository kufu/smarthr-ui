import React, { ReactNode } from 'react';
type Props = {
    inputRect: DOMRect;
    children: ReactNode;
};
export declare const Portal: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLDivElement>>;
export {};
