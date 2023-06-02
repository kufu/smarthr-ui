import React, { ReactNode } from 'react';
import { Props as CheckBoxInputProps } from './CheckBoxInput';
export type Props = {
    /** ラベル部分の `line-height` */
    lineHeight?: number;
    /** ラベルの内容 */
    children?: ReactNode;
} & CheckBoxInputProps;
export declare const CheckBox: React.ForwardRefExoticComponent<{
    /** ラベル部分の `line-height` */
    lineHeight?: number | undefined;
    /** ラベルの内容 */
    children?: ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement> & {
    mixed?: boolean | undefined;
    error?: boolean | undefined;
} & React.RefAttributes<HTMLInputElement>>;
