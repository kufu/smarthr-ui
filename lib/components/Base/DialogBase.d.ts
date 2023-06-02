import React, { HTMLAttributes, ReactNode } from 'react';
type Props = {
    children: ReactNode;
    radius?: 's' | 'm';
};
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>;
/**
 * @deprecated The DialogBase component is deprecated, so use Base component instead.
 */
export declare const DialogBase: React.ForwardRefExoticComponent<Props & ElementProps & React.RefAttributes<HTMLDivElement>>;
export {};
