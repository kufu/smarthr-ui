import { HTMLAttributes, VFC } from 'react';
type Props = {
    /** 全ページ数 */
    total: number;
    /** 現在のページ */
    current: number;
    /** ボタンを押下したときに発火するコールバック関数 */
    onClick: (pageNumber: number) => void;
    /** 現在のページの前後に表示するページ番号のボタンの数 */
    padding?: number;
    /** コンポーネントに適用するクラス名 */
    className?: string;
    /** `true` のとき、ページ番号のボタンを表示しない */
    withoutNumbers?: boolean;
};
type ElementProps = Omit<HTMLAttributes<HTMLElement>, keyof Props>;
export declare const Pagination: VFC<Props & ElementProps>;
export {};
