import { FC, ReactNode } from 'react';
declare type Props = {
    isFiltered?: boolean;
    onApply: () => void;
    onCancel?: () => void;
    onReset?: () => void;
    children: ReactNode;
};
export declare const FilterDropdown: FC<Props>;
export {};
