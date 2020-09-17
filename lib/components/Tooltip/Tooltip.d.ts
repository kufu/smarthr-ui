import React, { ReactNode } from 'react';
import { Props as BalloonProps } from '../Balloon';
declare type Props = {
    message: ReactNode;
    children: ReactNode;
    triggerType?: 'icon' | 'text';
    multiLine?: boolean;
    ellipsisOnly?: boolean;
    horizontal?: BalloonProps['horizontal'];
    vertical?: BalloonProps['vertical'];
};
export declare const LightTooltip: React.FC<Props>;
export declare const DarkTooltip: React.FC<Props>;
export {};
