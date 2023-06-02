import { FC, PropsWithChildren, ReactNode, ThHTMLAttributes } from 'react';
type sortTypes = keyof typeof SORT_DIRECTION_LABEL;
export type Props = PropsWithChildren<{
    /** 並び替え状態 */
    sort?: sortTypes;
    /** 並び替えをクリックした時に発火するコールバック関数 */
    onSort?: () => void;
    /** 文言を変更するための関数 */
    decorators?: {
        sortDirectionIconAlt: (text: string, { sort }: {
            sort: sortTypes;
        }) => ReactNode;
    };
    /** `true` のとき、TableReel内で固定表示になる */
    fixed?: boolean;
}>;
type ElementProps = Omit<ThHTMLAttributes<HTMLTableCellElement>, keyof Props | 'onClick'>;
declare const SORT_DIRECTION_LABEL: {
    asc: string;
    desc: string;
    none: string;
};
export declare const Th: FC<Props & ElementProps>;
export {};
