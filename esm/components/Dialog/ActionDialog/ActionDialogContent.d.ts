import React, { HTMLAttributes } from 'react';
import { UncontrolledDialogProps } from '../types';
import { BaseProps } from './ActionDialogContentInner';
type Props = BaseProps & UncontrolledDialogProps;
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>;
export declare const ActionDialogContent: React.VFC<Props & ElementProps>;
export {};
