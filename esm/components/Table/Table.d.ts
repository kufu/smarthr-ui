import React, { FC, ReactNode, TableHTMLAttributes } from 'react';
export declare const TableGroupContext: React.Context<{
    group: 'head' | 'body';
}>;
type Props = {
    /** `true` のとき、スクロール時にヘッダーを固定表示する */
    fixedHead?: boolean;
    /** テーブルの内容 */
    children?: ReactNode;
    /** コンポーネントに適用するクラス名 */
    className?: string;
};
type ElementProps = Omit<TableHTMLAttributes<HTMLTableElement>, keyof Props>;
export declare const Table: FC<Props & ElementProps>;
export {};
