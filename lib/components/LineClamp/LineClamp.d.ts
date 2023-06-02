import { HTMLAttributes, ReactNode, VFC } from 'react';
type Props = {
    /** 表示する最大行数 */
    maxLines?: number;
    /** 省略が発生した時にツールチップを表示するかどうか */
    withTooltip?: boolean;
    /** 表示行数を制限する対象となるコンテンツ */
    children: ReactNode;
};
type ElementProps = Omit<HTMLAttributes<HTMLSpanElement>, keyof Props>;
export declare const LineClamp: VFC<Props & ElementProps>;
export {};
