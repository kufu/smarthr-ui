import { HTMLAttributes, ReactNode, VFC } from 'react';
export type Props = {
    bulkActionArea?: ReactNode;
    children?: ReactNode;
    className?: string;
    fixed?: boolean;
};
type ElementProps = Omit<HTMLAttributes<HTMLTableSectionElement>, keyof Props>;
/**
 * @deprecated Head コンポーネントは非推奨です。thead 要素に置き換えてください。
 * thead 部分を固定表示する場合は Table コンポーネントの fixedHead Props を指定してください。
 * bulkActionArea を使う場合は BulkActionRow コンポーネントを使用してください。
 */
export declare const Head: VFC<Props & ElementProps>;
export {};
