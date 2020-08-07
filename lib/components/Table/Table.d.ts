import React, { FC, ReactNode } from 'react';
export declare const TableGroupContext: React.Context<{
    group: 'head' | 'body';
}>;
declare type Props = {
    children?: ReactNode;
    className?: string;
};
export declare const Table: FC<Props>;
export {};
