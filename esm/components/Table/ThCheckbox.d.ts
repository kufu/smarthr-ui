import React from 'react';
import { DecoratorsType } from '../../types/props';
type Props = {
    decorators?: DecoratorsType<'checkAllInvisibleLabel'>;
};
export declare const ThCheckbox: React.ForwardRefExoticComponent<{
    lineHeight?: number | undefined;
    children?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement> & {
    mixed?: boolean | undefined;
    error?: boolean | undefined;
} & Props & React.RefAttributes<HTMLInputElement>>;
export {};
