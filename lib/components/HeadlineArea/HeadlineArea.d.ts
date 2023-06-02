import { HTMLAttributes, ReactNode, VFC } from 'react';
import { Props as HeadingProps } from '../Heading';
type Props = {
    /** 見出し領域に表示する内容 */
    heading: {
        /** 見出しの内容 */
        children: HeadingProps['children'];
        /** 見出しの HTML タグ */
        tag?: HeadingProps['tag'];
    };
    /** 説明テキスト */
    description?: ReactNode;
    /** コンポーネントに適用するクラス名 */
    className?: string;
};
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>;
/**
 * @deprecated `HeadlineArea` は非推奨です。`Stack` で書き換えてください。
 */
export declare const HeadlineArea: VFC<Props & ElementProps>;
export {};
