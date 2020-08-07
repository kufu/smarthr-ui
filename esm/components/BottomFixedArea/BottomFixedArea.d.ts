import React, { ComponentProps, FC, FunctionComponentElement, ReactNode } from 'react';
import { TertiaryLink } from './TertiaryLink';
import { PrimaryButton, PrimaryButtonAnchor, SecondaryButton, SecondaryButtonAnchor } from '../Button';
export declare type Primary = FunctionComponentElement<ComponentProps<typeof PrimaryButton>> | FunctionComponentElement<ComponentProps<typeof PrimaryButtonAnchor>>;
export declare type Secondary = FunctionComponentElement<ComponentProps<typeof SecondaryButton>> | FunctionComponentElement<ComponentProps<typeof SecondaryButtonAnchor>>;
declare type Props = {
    description?: ReactNode;
    primaryButton?: Primary;
    secondaryButton?: Secondary;
    tertiaryLinks?: Array<React.ComponentProps<typeof TertiaryLink>>;
    zIndex?: number;
    className?: string;
};
export declare const BottomFixedArea: FC<Props>;
export {};
