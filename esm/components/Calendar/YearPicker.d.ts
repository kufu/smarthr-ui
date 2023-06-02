import { FC, HTMLAttributes } from 'react';
type Props = {
    /** 選択された年 */
    selectedYear?: number;
    /** 選択可能な開始年 */
    fromYear: number;
    /** 選択可能な終了年 */
    toYear: number;
    /** トリガのセレクトイベントを処理するハンドラ */
    onSelectYear: (year: number) => void;
    /** 表示フラグ */
    isDisplayed: boolean;
    /** HTMLのid属性 */
    id: string;
};
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>;
export declare const YearPicker: FC<Props & ElementProps>;
export {};
