import React, { HTMLAttributes, MouseEvent } from 'react';
type Props = {
    /** 選択可能な開始日 */
    from?: Date;
    /** 選択可能な終了日 */
    to?: Date;
    /** トリガのセレクトイベントを処理するハンドラ */
    onSelectDate: (e: MouseEvent, date: Date) => void;
    /** 選択された日付 */
    value?: Date;
};
type ElementProps = Omit<HTMLAttributes<HTMLElement>, keyof Props>;
export declare const Calendar: React.ForwardRefExoticComponent<Props & ElementProps & React.RefAttributes<HTMLElement>>;
export {};
