import { FC, HTMLAttributes } from 'react';
import { DefinitionListItemProps } from './DefinitionListItem';
type LayoutType = 'single' | 'double' | 'triple';
type Props = {
    /** 定義リストのアイテムの配列 */
    items: DefinitionListItemProps[];
    /** 列のレイアウト */
    layout?: LayoutType;
    /** コンポーネントに適用するクラス名 */
    className?: string;
};
type ElementProps = Omit<HTMLAttributes<HTMLDListElement>, keyof Props>;
export declare const DefinitionList: FC<Props & ElementProps>;
export {};
