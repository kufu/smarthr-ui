import { FC, PropsWithChildren, ReactNode } from 'react';
type Props = PropsWithChildren<{
    needsTooltip: boolean;
    text: ReactNode;
    children: ReactNode;
}>;
export declare const MultiSelectedItemTooltip: FC<Props>;
export {};
