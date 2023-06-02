import React, { HTMLAttributes, PropsWithChildren } from 'react';
import { Gap } from '../Layout';
type Padding = Gap | {
    vertical?: Gap;
    horizontal?: Gap;
};
type Props = PropsWithChildren<{
    /** 境界とコンテンツの間の余白 */
    padding?: Padding;
}>;
type ElementProps = Omit<HTMLAttributes<HTMLTableSectionElement>, keyof Props>;
export declare const EmptyTableBody: React.FC<Props & ElementProps>;
export {};
