import { FC } from 'react';
declare type Props = {
    targetPage: number;
    onClick: (pageNumber: number) => void;
    direction: 'prev' | 'next';
    disabled: boolean;
    double?: boolean;
};
export declare const PaginationControllerItem: FC<Props>;
export {};
