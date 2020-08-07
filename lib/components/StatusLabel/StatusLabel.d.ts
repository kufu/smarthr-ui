import { FC } from 'react';
declare type Props = {
    type?: 'done' | 'success' | 'process' | 'required' | 'disabled' | 'must' | 'warning' | 'error';
    className?: string;
    children: string;
};
export declare const StatusLabel: FC<Props>;
export {};
