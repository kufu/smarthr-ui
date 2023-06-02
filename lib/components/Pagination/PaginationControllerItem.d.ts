import { VFC } from 'react';
type Props = {
    targetPage: number;
    onClick: (pageNumber: number) => void;
    direction: 'prev' | 'next';
    disabled: boolean;
    double?: boolean;
};
export declare const PaginationControllerItem: VFC<Props>;
export {};
