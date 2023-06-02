import React, { HTMLAttributes, PropsWithChildren } from 'react';
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof PropsWithChildren>;
export declare const TableReel: React.FC<PropsWithChildren & ElementProps>;
export {};
