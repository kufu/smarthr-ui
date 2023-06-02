import { ComponentProps, HTMLAttributes, VFC } from 'react';
import { OnClick, SideNavItem, SideNavSizeType } from './SideNavItem';
type SideNavItemProps = Omit<ComponentProps<typeof SideNavItem>, 'size' | 'onClick'>;
type Props = {
    /** 各アイテムのデータの配列 */
    items: SideNavItemProps[];
    /** 各アイテムの大きさ */
    size?: SideNavSizeType;
    /** アイテムを押下したときに発火するコールバック関数 */
    onClick?: OnClick;
    /** コンポーネントに適用するクラス名 */
    className?: string;
};
type ElementProps = Omit<HTMLAttributes<HTMLUListElement>, keyof Props>;
export declare const SideNav: VFC<Props & ElementProps>;
export {};
