import React, { ReactNode } from 'react';
import { Props as CheckBoxProps } from '../CheckBox';
type Props = {
    /** 値を特定するための行 id */
    'aria-labelledby': string;
    /** aria-labelledby では特定できない場合に補足するための不可視ラベル */
    children?: ReactNode;
};
export declare const TdCheckbox: React.ForwardRefExoticComponent<Omit<CheckBoxProps, keyof Props> & Props & React.RefAttributes<HTMLInputElement>>;
export {};
