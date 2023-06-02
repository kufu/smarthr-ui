import React, { ReactNode, VFC } from 'react';
export type SideNavSizeType = 'default' | 's';
export type OnClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => void;
type Props = {
    /** アイテムの識別子 */
    id: string;
    /** アイテムのタイトル */
    title: ReactNode;
    /** タイトルのプレフィックスの内容。通常、StatusLabel の配置に用います。 */
    prefix?: ReactNode;
    /** 選択されているアイテムかどうか */
    isSelected?: boolean;
    /** アイテムの大きさ */
    size?: SideNavSizeType;
    /** アイテムを押下したときに発火するコールバック関数 */
    onClick?: OnClick;
};
export declare const SideNavItem: VFC<Props>;
export {};
