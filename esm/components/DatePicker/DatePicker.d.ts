import { FC } from 'react';
declare type Props = {
    date?: Date | null;
    onChangeDate?: (date: Date | null) => void;
    parsingErrorMessage?: string;
    parseInput?: (input: string) => Date | null;
    formatDate?: (date: Date | null) => string;
    className?: string;
};
export declare const DatePicker: FC<Props>;
export {};
