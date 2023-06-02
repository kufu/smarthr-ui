import React, { SelectHTMLAttributes } from 'react';
import { DecoratorsType } from '../../types/props';
type Option<T extends string> = {
    value: T;
} & Omit<React.OptionHTMLAttributes<HTMLOptionElement>, 'value'>;
type Optgroup<T extends string> = {
    label: string;
    options: Array<Option<T>>;
} & React.OptgroupHTMLAttributes<HTMLOptGroupElement>;
type Props<T extends string> = {
    /** 選択肢のデータの配列 */
    options: Array<Option<T> | Optgroup<T>>;
    /** フォームの値が変わったときに発火するコールバック関数 */
    onChangeValue?: (value: T) => void;
    /** フォームの値にエラーがあるかどうか */
    error?: boolean;
    /** コンポーネントの幅 */
    width?: number | string;
    /** コンポーネントの大きさ */
    size?: 'default' | 's';
    /** 空の選択肢を表示するかどうか */
    hasBlank?: boolean;
    /** コンポーネント内の文言を変更するための関数を設定 */
    decorators?: DecoratorsType<'blankLabel'>;
};
type ElementProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, keyof Props<string> | 'children'>;
export declare const Select: React.ForwardRefExoticComponent<Props<string> & ElementProps & React.RefAttributes<HTMLSelectElement>>;
export {};
