import { FC, ReactNode } from 'react';
export declare type Props = {
    colSpan?: number;
    rowSpan?: number;
    highlighted?: boolean;
    nullable?: boolean;
    children?: ReactNode;
    className?: string;
    onClick?: () => void;
};
export declare const Cell: FC<Props>;
