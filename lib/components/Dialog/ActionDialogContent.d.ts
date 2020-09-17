import React from 'react';
import { BaseProps } from './ActionDialogContentInner';
export declare type ActionDialogContentProps = BaseProps & {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
};
export declare const ActionDialogContent: React.FC<ActionDialogContentProps>;
