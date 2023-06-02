import { HTMLAttributes, ReactNode, VFC } from 'react';
export type Props = {
    /** 一括操作エリアの内容 */
    children?: ReactNode;
    /** コンポーネントに適用するクラス名 */
    className?: string;
};
type ElementProps = Omit<HTMLAttributes<HTMLTableRowElement>, keyof Props>;
export declare const BulkActionRow: VFC<Props & ElementProps>;
export {};
