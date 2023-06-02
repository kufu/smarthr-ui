import React, { CSSProperties, HTMLAttributes, PropsWithChildren } from 'react';
import { Gap } from '../Layout';
type Props = PropsWithChildren<{
    /** 境界とコンテンツの間の余白 */
    padding?: Gap | SeparatePadding;
    /** 角丸のサイズ */
    radius?: 's' | 'm';
    /** コンテンツが要素内に収まらない場合の処理方法 */
    overflow?: CSSProperties['overflow'] | {
        x: CSSProperties['overflowX'];
        y: CSSProperties['overflowY'];
    };
    /** レイヤの重なり方向の高さ（影の付き方に影響する） */
    layer?: LayerKeys;
}>;
export type LayerKeys = keyof typeof layerMap;
export declare const layerMap: {
    readonly 0: "LAYER0";
    readonly 1: "LAYER1";
    readonly 2: "LAYER2";
    readonly 3: "LAYER3";
    readonly 4: "LAYER4";
};
type SeparatePadding = {
    block?: Gap;
    inline?: Gap;
};
export type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>;
export declare const Base: React.ForwardRefExoticComponent<{
    /** 境界とコンテンツの間の余白 */
    padding?: Gap | SeparatePadding | undefined;
    /** 角丸のサイズ */
    radius?: "s" | "m" | undefined;
    /** コンテンツが要素内に収まらない場合の処理方法 */
    overflow?: CSSProperties['overflow'] | {
        x: CSSProperties['overflowX'];
        y: CSSProperties['overflowY'];
    };
    /** レイヤの重なり方向の高さ（影の付き方に影響する） */
    layer?: 0 | 2 | 1 | 3 | 4 | undefined;
} & {
    children?: React.ReactNode;
} & ElementProps & React.RefAttributes<HTMLDivElement>>;
export {};
