import { HTMLAttributes, MouseEvent, VFC } from 'react';
type Props = {
    /** 現在の日付 */
    current: Date;
    /** 選択可能な開始日 */
    from: Date;
    /** 選択可能な終了日 */
    to: Date;
    /** トリガのセレクトイベントを処理するハンドラ */
    onSelectDate: (e: MouseEvent, date: Date) => void;
    /** 選択された日付 */
    selected?: Date | null;
};
type ElementProps = Omit<HTMLAttributes<HTMLTableElement>, keyof Props>;
export declare const CalendarTable: VFC<Props & ElementProps>;
export {};
