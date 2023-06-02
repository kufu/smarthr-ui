import React, { ComponentProps } from 'react';
import { DecoratorsType } from '../../../types/props';
import { InputWithTooltip } from '../InputWithTooltip';
type Props = Omit<ComponentProps<typeof InputWithTooltip>, 'tooltipMessage' | 'prefix'> & {
    /** 入力欄の説明を紐付けるツールチップに表示するメッセージ */
    tooltipMessage: React.ReactNode;
    decorators?: DecoratorsType<'iconAlt'>;
};
export declare const SearchInput: React.ForwardRefExoticComponent<Omit<Props, "ref"> & React.RefAttributes<HTMLInputElement>>;
export {};
