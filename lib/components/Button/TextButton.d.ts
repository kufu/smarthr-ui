import { FC } from 'react';
import { AnchorProps as BaseAnchorProps, ButtonProps as BaseButtonProps } from './BaseButton';
declare type ButtonProps = Omit<BaseButtonProps, 'square'>;
declare type AnchorProps = Omit<BaseAnchorProps, 'square'>;
export declare const TextButton: FC<ButtonProps>;
export declare const TextButtonAnchor: FC<AnchorProps>;
export {};
