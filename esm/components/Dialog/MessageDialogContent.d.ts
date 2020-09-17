import React from 'react';
import { BaseProps } from './MessageDialogContentInner';
export declare type MessageDialogContentProps = BaseProps & {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
};
export declare const MessageDialogContent: React.FC<MessageDialogContentProps>;
