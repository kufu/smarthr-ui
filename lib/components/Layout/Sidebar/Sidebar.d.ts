import type { Gap, SeparateGap } from '../type';
import type { CSSProperties } from 'react';
type Props = {
    /** 各領域の縦位置の揃え方（align-items） */
    align?: CSSProperties['alignItems'];
    /** コンポーネントの `min-width` 値 */
    contentsMinWidth?: CSSProperties['minWidth'];
    /** 各領域の間隔の指定（gap） */
    gap?: Gap | SeparateGap;
    /** `true` のとき、サイドコンテンツを右側に表示する */
    right?: boolean;
};
export declare const Sidebar: import("styled-components").StyledComponent<"div", any, Props, never>;
export {};
