import React, { HTMLAttributes, ReactNode, VFC } from 'react';
import { ComponentProps as IconProps } from '../Icon';
type ElementProps = Omit<HTMLAttributes<HTMLButtonElement>, keyof Props>;
type Props = {
    text: ReactNode;
    icon?: React.ComponentType<IconProps>;
    type?: 'button' | 'reset';
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};
export declare const TertiaryLink: VFC<Props & ElementProps>;
export {};
