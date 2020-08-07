import { FC, ReactNode } from 'react';
import { Props as HeadingProps } from '../Heading';
export declare type DefinitionListItemProps = {
    term: ReactNode;
    description: ReactNode;
    termTag?: HeadingProps['tag'];
    className?: string;
};
export declare const DefinitionListItem: FC<DefinitionListItemProps>;
