import React, { HTMLAttributes } from 'react';
export type Props = {
    children?: React.ReactNode;
    className?: string;
};
type ElementProps = Omit<HTMLAttributes<HTMLTableRowElement>, keyof Props>;
/**
 * @deprecated Row コンポーネントは非推奨です。tr 要素に置き換えてください。
 */
export declare const Row: React.VFC<Props & ElementProps>;
export {};
