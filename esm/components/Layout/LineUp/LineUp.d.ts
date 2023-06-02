type alignMethod = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
type verticalAlignMethod = 'normal' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
/**
 * @deprecated LineUp コンポーネントは非推奨です。Cluster または Sidebar コンポーネントを使用してください。
 * @param inline true の場合は inline-flex
 * @param gap 間隔の指定（基準フォントサイズの相対値または抽象値）。align が space-between や space-around を取る場合は無視されます
 * @param reverse 並べる方向の指定（flex-direction）
 * @param align 並べ方の指定（justify-content）
 * @param vAlign 縦位置の揃え方（align-items）
 */
export declare const LineUp: import("styled-components").StyledComponent<"div", any, {
    /** true の場合は inline-flex */
    inline?: boolean | undefined;
    /** 間隔の指定（基準フォントサイズの相対値または抽象値）。align が space-between や space-around を取る場合は無視されます */
    gap?: 0 | 2 | 1 | 3 | 4 | 8 | -1 | 1.25 | 1.5 | 2.5 | 0.5 | -2 | -3 | 0.25 | 0.75 | 3.5 | -0.25 | -0.5 | -0.75 | -1.25 | -1.5 | -2.5 | -3.5 | -4 | -8 | keyof import("../../../themes/createSpacing").CreatedSpacingTheme | undefined;
    /** 並べる方向の指定（flex-direction） */
    reverse?: boolean | undefined;
    /** 並べ方の指定（justify-content） */
    align?: alignMethod | undefined;
    /** 縦位置の揃え方（align-items） */
    vAlign?: verticalAlignMethod | undefined;
}, never>;
export {};
