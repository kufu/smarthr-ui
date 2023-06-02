import React, { HTMLAttributes } from 'react';
import { UncontrolledDialogProps } from '../types';
import { BaseProps } from './MessageDialogContentInner';
type Props = BaseProps & UncontrolledDialogProps;
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>;
export declare const MessageDialogContent: React.VFC<Props & ElementProps>;
export {};
