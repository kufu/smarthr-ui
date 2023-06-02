import { HTMLAttributes, VFC } from 'react';
type Props = {
    /** コンポーネントのタイトル */
    alt?: string;
    /** コンポーネントの幅 */
    width?: number | string;
    /** コンポーネントの高さ */
    height?: number | string;
    /** ロゴの色 */
    fill?: 'white' | 'brand' | 'black';
    /** コンポーネントに適用するクラス名 */
    className?: string;
};
type ElementProps = Omit<HTMLAttributes<HTMLElement>, keyof Props>;
export declare const SmartHRLogo: VFC<Props & ElementProps>;
export {};
