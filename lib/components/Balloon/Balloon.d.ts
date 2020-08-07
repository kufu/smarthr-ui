import React, { ReactNode } from 'react';
export declare type BalloonTheme = 'light' | 'dark';
export declare type Props = {
    horizontal: 'right' | 'center' | 'left';
    vertical: 'top' | 'middle' | 'bottom';
    className?: string;
    children?: ReactNode;
};
export declare const LightBalloon: React.FC<Props>;
export declare const DarkBalloon: React.FC<Props>;
