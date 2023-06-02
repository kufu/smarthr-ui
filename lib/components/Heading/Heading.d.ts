import { HTMLAttributes, ReactNode, VFC } from 'react';
import { TextProps } from '../Text';
export type Props = {
    /** 表示するテキスト */
    children: ReactNode;
    /** テキストのスタイル */
    type?: HeadingTypes;
    /** コンポーネントの HTML タグ */
    tag?: HeadingTagTypes;
    /** コンポーネントに適用するクラス名 */
    className?: string;
};
export type HeadingTypes = 'screenTitle' | 'sectionTitle' | 'blockTitle' | 'subBlockTitle' | 'subSubBlockTitle';
export type HeadingTagTypes = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'legend';
type ElementProps = Omit<HTMLAttributes<HTMLElement>, keyof Props | keyof TextProps>;
export declare const Heading: VFC<Props & ElementProps>;
export {};
