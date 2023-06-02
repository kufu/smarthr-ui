import React, { CSSProperties, HTMLAttributes } from 'react';
import { TextColors } from '../../themes/createColor';
import { FontSizes } from '../../themes/createFontSize';
import { Leadings } from '../../themes/createLeading';
export type TextProps = {
    size?: FontSizes;
    weight?: CSSProperties['fontWeight'];
    italic?: boolean;
    color?: TextColors | 'inherit';
    leading?: Leadings;
    whiteSpace?: CSSProperties['whiteSpace'];
    emphasis?: boolean;
};
type ElementProps = Omit<HTMLAttributes<HTMLElement>, keyof TextProps>;
export type Props = TextProps & ElementProps & {
    as?: string | React.ComponentType<any> | undefined;
    children: React.ReactNode;
};
/**
 * @param [size] フォントサイズの抽象値（font-size）
 * @param [weight] フォントウェイト（font-weight）
 * @param [italic] 斜体にするかどうかの真偽値（font-style: italic）
 * @param [color] 色。初期値は inherit（color、）
 * @param [leading] 行送りの抽象値（line-height）
 * @param [whiteSpace] ホワイトスペース（white-space）
 * @param [emphasis] 強調するかどうかの真偽値。指定すると em 要素になる
 * @param [as] テキストコンポーネントの HTML タグ名。初期値は span
 * @param [children]
 */
export declare const Text: React.FC<Props>;
export {};
