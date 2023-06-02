import React from 'react';
import { Input } from '../Input';
type Props = Omit<React.ComponentProps<typeof Input>, 'type' | 'value' | 'defaultValue' | 'placeholder'> & {
    /** 通貨の値 */
    value?: string;
    /** デフォルトで表示する通貨の値 */
    defaultValue?: string;
    /** 入力値がフォーマットされたときに発火するコールバック関数 */
    onFormatValue?: (value: string) => void;
    /**
     * @deprecated placeholder属性は非推奨です。別途ヒント用要素を設置するか、それらの領域を確保出来ない場合はTooltipコンポーネントの利用を検討してください。
     */
    placeholder?: string;
};
export declare const CurrencyInput: React.ForwardRefExoticComponent<Omit<Props, "ref"> & React.RefAttributes<HTMLInputElement>>;
export {};
