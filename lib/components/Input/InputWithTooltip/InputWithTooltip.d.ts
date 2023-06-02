import React, { ComponentProps } from 'react';
import { Input } from '../Input';
type Props = ComponentProps<typeof Input> & {
    /** 入力欄に紐付けるツールチップに表示するメッセージ */
    tooltipMessage: React.ReactNode;
};
export declare const InputWithTooltip: React.ForwardRefExoticComponent<Omit<Props, "ref"> & React.RefAttributes<HTMLInputElement>>;
export {};
