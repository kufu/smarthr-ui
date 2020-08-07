import React, { FC, ReactNode } from 'react';
import { Props as IconProps } from '../Icon';
export declare type AppNaviButtonProps = {
    children: ReactNode;
    icon?: IconProps['name'];
    current?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};
declare type InnerProps = AppNaviButtonProps & {
    isUnclickable?: boolean;
};
export declare const AppNaviButton: FC<InnerProps>;
export {};
