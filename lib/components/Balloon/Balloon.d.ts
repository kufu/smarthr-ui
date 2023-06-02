import { HTMLAttributes, ReactNode, VFC } from 'react';
export type BalloonTheme = 'light' | 'dark';
export type Props = {
    /** 吹き出しの垂直位置 */
    horizontal: 'right' | 'center' | 'left';
    /** 吹き出しの水平位置 */
    vertical: 'top' | 'middle' | 'bottom';
    /** コンポーネントに適用するクラス名 */
    className?: string;
    /** バルーン内のコンテンツ */
    children?: ReactNode;
    /** レンダリングするタグ */
    as?: 'div' | 'span';
};
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>;
export declare const Balloon: VFC<Props & ElementProps>;
export {};
