import React, { ReactNode } from 'react';
import { Props as RadioButtonInputProps } from './RadioButtonInput';
export declare const RadioButton: React.ForwardRefExoticComponent<{
    /** ラベルの行高 */
    lineHeight?: number | undefined;
    /** ラジオボタンのラベル */
    children?: ReactNode;
} & RadioButtonInputProps & React.RefAttributes<HTMLInputElement>>;
