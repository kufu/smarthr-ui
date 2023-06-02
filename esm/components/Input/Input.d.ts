import React, { InputHTMLAttributes, ReactNode } from 'react';
import { GreyScaleColors } from '../../themes/createColor';
type Props = {
    /** input 要素の `type` 値 */
    type?: HTMLInputElement['type'];
    /** フォームにエラーがあるかどうか */
    error?: boolean;
    /** コンポーネントの幅 */
    width?: number | string;
    /** オートフォーカスを行うかどうか */
    autoFocus?: boolean;
    /** コンポーネント内の先頭に表示する内容 */
    prefix?: ReactNode;
    /** コンポーネント内の末尾に表示する内容 */
    suffix?: ReactNode;
    /** 背景色。readOnly を下地の上に載せる場合に使う */
    bgColor?: GreyScaleColors | 'WHITE';
    /**
     * @deprecated placeholder属性は非推奨です。別途ヒント用要素を設置するか、それらの領域を確保出来ない場合はTooltipコンポーネントの利用を検討してください。
     */
    placeholder?: string;
};
type ElementProps = Omit<InputHTMLAttributes<HTMLInputElement>, keyof Props>;
export declare const Input: React.ForwardRefExoticComponent<Props & ElementProps & React.RefAttributes<HTMLInputElement>>;
export {};
