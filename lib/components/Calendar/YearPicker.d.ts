import { FC } from 'react';
declare type Props = {
    selectedYear?: number;
    fromYear: number;
    toYear: number;
    onSelectYear: (year: number) => void;
};
export declare const YearPicker: FC<Props>;
export {};
