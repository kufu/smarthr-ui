import React from 'react';
export type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    /** `true` のとき、チェック状態を `mixed` にする */
    mixed?: boolean;
    /** チェックボックスにエラーがあるかどうか */
    error?: boolean;
};
export declare const CheckBoxInput: React.ForwardRefExoticComponent<React.InputHTMLAttributes<HTMLInputElement> & {
    /** `true` のとき、チェック状態を `mixed` にする */
    mixed?: boolean | undefined;
    /** チェックボックスにエラーがあるかどうか */
    error?: boolean | undefined;
} & React.RefAttributes<HTMLInputElement>>;
