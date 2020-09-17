import { FC, MouseEvent } from 'react';
declare type Props = {
    current: Date;
    from: Date;
    to: Date;
    onSelectDate: (e: MouseEvent, date: Date) => void;
    selected?: Date | null;
};
export declare const CalendarTable: FC<Props>;
export {};
