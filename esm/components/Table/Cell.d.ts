import { ReactNode, TdHTMLAttributes, VFC } from 'react';
export type Props = {
    colSpan?: number;
    rowSpan?: number;
    highlighted?: boolean;
    nullable?: boolean;
    children?: ReactNode;
    className?: string;
    onClick?: () => void;
};
type ElementProps = Omit<TdHTMLAttributes<HTMLTableCellElement>, keyof Props>;
/**
 * @deprecated Cell コンポーネントは非推奨です。代わりに Th または Td コンポーネントを使用してください。
 */
export declare const Cell: VFC<Props & ElementProps>;
export {};
