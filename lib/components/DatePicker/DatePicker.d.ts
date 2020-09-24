import { FC } from 'react';
declare type Props = {
    value?: string | null;
    onChangeDate?: (date: Date | null, value: string) => void;
    parseInput?: (input: string) => Date | null;
    formatDate?: (date: Date | null) => string;
    name?: string;
    disabled?: boolean;
    error?: boolean;
    className?: string;
};
export declare const DatePicker: FC<Props>;
export {};
