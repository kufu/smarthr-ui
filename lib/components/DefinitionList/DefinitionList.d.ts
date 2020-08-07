import { FC } from 'react';
import { DefinitionListItemProps } from './DefinitionListItem';
declare type LayoutType = 'single' | 'double' | 'triple';
declare type Props = {
    items: DefinitionListItemProps[];
    layout?: LayoutType;
    className?: string;
};
export declare const DefinitionList: FC<Props>;
export {};
