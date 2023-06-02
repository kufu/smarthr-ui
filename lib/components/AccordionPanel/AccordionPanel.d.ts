import React, { HTMLAttributes } from 'react';
type Props = {
    /** アコーディオンの内容 */
    children: React.ReactNode;
    /** アイコンの左右位置 */
    iconPosition?: 'left' | 'right';
    /** アイコンを表示するかどうか */
    displayIcon?: boolean;
    /** 複数のパネルを同時に開くことを許容するかどうか */
    expandableMultiply?: boolean;
    /** デフォルトで開いた状態にするアイテムの `name` の配列 */
    defaultExpanded?: string[];
    /** コンポーネントのクラス名 */
    className?: string;
    /** トリガのクリックイベントを処理するハンドラ */
    onClick?: (expandedItems: string[]) => void;
};
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>;
export declare const AccordionPanelContext: React.Context<{
    iconPosition: 'left' | 'right';
    displayIcon: boolean;
    expandedItems: Map<string, string>;
    expandableMultiply: boolean;
    parentRef: React.RefObject<HTMLDivElement> | null;
    onClickTrigger?: ((itemName: string, isExpanded: boolean) => void) | undefined;
    onClickProps?: ((expandedItems: string[]) => void) | undefined;
}>;
export declare const AccordionPanel: React.VFC<Props & ElementProps>;
export {};
