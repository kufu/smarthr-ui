import { FC, PropsWithChildren, TdHTMLAttributes } from 'react';
export type Props = PropsWithChildren<{
    /** `true` のとき、セル内が空であれば "----" を表示する */
    nullable?: boolean;
    /** `true` のとき、TableReel内で固定表示になる */
    fixed?: boolean;
}>;
type ElementProps = Omit<TdHTMLAttributes<HTMLTableCellElement>, keyof Props>;
export declare const Td: FC<Props & ElementProps>;
export {};
