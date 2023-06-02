import React, { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import { DecoratorsType, ResponseMessageType } from '../../../types/props';
type Props = {
    isFiltered?: boolean;
    onApply: React.MouseEventHandler<HTMLButtonElement>;
    onCancel?: React.MouseEventHandler<HTMLButtonElement>;
    onReset?: React.MouseEventHandler<HTMLButtonElement>;
    children: ReactNode;
    hasStatusText?: boolean;
    decorators?: DecoratorsType<'status' | 'triggerButton' | 'applyButton' | 'cancelButton' | 'resetButton'>;
    responseMessage?: ResponseMessageType;
};
type ElementProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Props>;
export declare const FilterDropdown: FC<Props & ElementProps>;
export {};
