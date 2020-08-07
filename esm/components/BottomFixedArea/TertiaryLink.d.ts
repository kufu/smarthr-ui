import React, { FC } from 'react';
import { iconMap } from '../Icon';
declare type Props = {
    text: string;
    iconName?: keyof typeof iconMap;
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};
export declare const TertiaryLink: FC<Props>;
export {};
