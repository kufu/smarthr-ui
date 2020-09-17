import React, { MouseEvent } from 'react';
declare type Props = {
    from?: Date;
    to?: Date;
    onSelectDate: (e: MouseEvent, date: Date) => void;
    value?: Date;
};
export declare const Calendar: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLElement>>;
export {};
