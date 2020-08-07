import { FC } from 'react';
interface Props {
    total: number;
    current: number;
    onClick: (pageNumber: number) => void;
    padding?: number;
    className?: string;
    withoutNumbers?: boolean;
}
export declare const Pagination: FC<Props>;
export {};
