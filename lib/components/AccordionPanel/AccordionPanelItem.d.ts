import React, { HTMLAttributes, VFC } from 'react';
type Props = {
    /** アイテムを識別するための名前 */
    name: string;
    /** アコーディオンのアイテムの内容 */
    children: React.ReactNode;
    /** アイテムのクラス名 */
    className?: string;
};
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>;
export declare const AccordionPanelItemContext: React.Context<{
    name: string;
}>;
export declare const AccordionPanelItem: VFC<Props & ElementProps>;
export {};
