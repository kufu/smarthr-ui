import React, { AnchorHTMLAttributes, ButtonHTMLAttributes, ForwardedRef, ReactNode } from 'react';
import { Variant } from './types';
type BaseProps = {
    size: 'default' | 's';
    square: boolean;
    wide: boolean;
    variant: Variant;
    $loading?: boolean;
    className: string;
    children: ReactNode;
};
type ButtonProps = BaseProps & {
    isAnchor?: never;
    buttonRef?: ForwardedRef<HTMLButtonElement>;
};
type AnchorProps = BaseProps & {
    isAnchor: true;
    anchorRef?: ForwardedRef<HTMLAnchorElement>;
};
type Props = (ButtonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonProps>) | (AnchorProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof AnchorProps>);
export declare function ButtonWrapper({ size, square, className, ...props }: Props): React.JSX.Element;
export {};
