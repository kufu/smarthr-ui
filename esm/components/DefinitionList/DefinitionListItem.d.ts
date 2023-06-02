import { FC, HTMLAttributes, ReactNode } from 'react';
export type DefinitionListItemProps = {
    term: ReactNode;
    description?: ReactNode;
    className?: string;
};
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof DefinitionListItemProps>;
export declare const DefinitionListItem: FC<DefinitionListItemProps & ElementProps>;
export {};
