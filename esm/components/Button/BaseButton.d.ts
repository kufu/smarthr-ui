import React, { FC } from 'react';
declare type Tag = 'button' | 'a';
declare type Size = 'default' | 's';
declare type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
export declare type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size' | 'prefix'> & BaseProps;
export declare type AnchorProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'prefix'> & BaseProps;
export declare type BaseProps = {
    size?: Size;
    children?: React.ReactNode;
    className?: string;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    square?: boolean;
    wide?: boolean;
};
export declare const buttonFactory: <Props extends BaseProps>(tag: Tag) => FC<Props>;
export declare const BaseButton: FC<ButtonProps>;
export declare const BaseButtonAnchor: FC<AnchorProps>;
export {};
