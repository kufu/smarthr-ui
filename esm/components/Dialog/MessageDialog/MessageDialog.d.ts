import React, { HTMLAttributes } from 'react';
import { DialogProps } from '../types';
import { MessageDialogContentInnerProps } from './MessageDialogContentInner';
type Props = Omit<MessageDialogContentInnerProps, 'titleId'> & DialogProps;
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>;
export declare const MessageDialog: React.VFC<Props & ElementProps>;
export {};
