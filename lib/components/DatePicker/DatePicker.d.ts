import React, { ReactNode } from 'react';
type Props = {
    /** input 要素の `value` 属性の値 */
    value?: string | null;
    /** input 要素の `name` 属性の値 */
    name?: string;
    /** 選択可能な期間の開始日 */
    from?: Date;
    /** 選択可能な期間の終了日 */
    to?: Date;
    /** フォームを無効にするかどうか */
    disabled?: boolean;
    /**
     * @deprecated placeholder属性は非推奨です。別途ヒント用要素を設置するか、それらの領域を確保出来ない場合はTooltipコンポーネントの利用を検討してください。
     */
    placeholder?: string;
    /** フォームにエラーがあるかどうか */
    error?: boolean;
    /** コンポーネントの幅 */
    width?: number | string;
    /** コンポーネントに適用するクラス名 */
    className?: string;
    /** 入力を独自にパースする場合に、パース処理を記述する関数 */
    parseInput?: (input: string) => Date | null;
    /** 表示する日付を独自にフォーマットする場合に、フォーマット処理を記述する関数 */
    formatDate?: (date: Date | null) => string;
    /** 入出力用文字列と併記する別フォーマット処理を記述する関数 */
    showAlternative?: (date: Date | null) => ReactNode;
    /** 選択された日付が変わった時に発火するコールバック関数 */
    onChangeDate?: (date: Date | null, value: string, other: {
        errors: string[];
    }) => void;
};
type OmitInputAttributes = keyof Props | 'type' | 'onChange' | 'onKeyPress' | 'onFocus' | 'onBlur' | 'aria-expanded' | 'aria-controls' | 'aria-haspopup';
type InputAttributes = Omit<React.InputHTMLAttributes<HTMLInputElement>, OmitInputAttributes>;
export declare const DEFAULT_FROM: Date;
export declare const DatePicker: React.ForwardRefExoticComponent<Props & InputAttributes & React.RefAttributes<HTMLInputElement>>;
export {};
