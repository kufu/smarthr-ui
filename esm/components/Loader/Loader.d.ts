import { HTMLAttributes, ReactNode, VFC } from 'react';
type Props = {
    /** ローダーの大きさ */
    size?: 's' | 'm';
    /** 代替テキスト */
    alt?: ReactNode;
    /** 表示するメッセージ */
    text?: ReactNode;
    /** コンポーネントの色調 */
    type?: 'primary' | 'light';
};
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>;
export declare const Loader: VFC<Props & ElementProps>;
export {};
