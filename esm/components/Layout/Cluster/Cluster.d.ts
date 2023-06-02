import type { Gap, SeparateGap } from '../type';
import type { CSSProperties } from 'react';
export declare const Cluster: import("styled-components").StyledComponent<"div", any, {
    /** true の場合は inline-flex */
    inline?: boolean | undefined;
    /** 間隔の指定（基準フォントサイズの相対値または抽象値） */
    gap?: Gap | SeparateGap | undefined;
    /** 垂直方向の揃え方（align-items） */
    align?: CSSProperties['alignItems'];
    /** 水平方向の揃え方（justify-content） */
    justify?: CSSProperties['justifyContent'];
}, never>;
