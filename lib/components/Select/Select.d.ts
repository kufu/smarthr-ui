import { FC, SelectHTMLAttributes } from 'react';
declare type Option = {
    label: string;
    value: string;
};
declare type Optgroup = {
    label: string;
    options: Option[];
};
declare type Props = SelectHTMLAttributes<HTMLSelectElement> & {
    options: Array<Option | Optgroup>;
    error?: boolean;
    width?: number | string;
};
export declare const Select: FC<Props>;
export {};
