import { CSSProperties } from 'react';
/**
 * @param inline true の場合は inline-flex
 * @param gap 間隔の指定（基準フォントサイズの相対値または抽象値）
 * @param align 並べ方の指定（align-items）
 * @param recursive 直下の要素だけでなく再帰的に適用するかどうかの指定
 * @param splitAfter 分割する位置の指定（nth-child に渡す値）
 */
export declare const Stack: import("styled-components").StyledComponent<"div", any, {
    /** true の場合は inline-flex */
    inline?: boolean | undefined;
    /** 間隔の指定（基準フォントサイズの相対値または抽象値） */
    gap?: 0 | 2 | 1 | 3 | 4 | 8 | -1 | 1.25 | 1.5 | 2.5 | 0.5 | -2 | -3 | 0.25 | 0.75 | 3.5 | -0.25 | -0.5 | -0.75 | -1.25 | -1.5 | -2.5 | -3.5 | -4 | -8 | keyof import("../../../themes/createSpacing").CreatedSpacingTheme | undefined;
    /** 並べ方の指定（align-items） */
    align?: CSSProperties['alignItems'];
    /** 直下の要素だけでなく再帰的に適用するかどうかの指定 */
    recursive?: boolean | undefined;
    /** 分割する位置の指定（nth-child に渡す値） */
    splitAfter?: string | number | undefined;
}, never>;
