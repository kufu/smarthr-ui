import React, { HTMLAttributes } from 'react';
import { UncontrolledDialogProps } from '../types';
import { BaseProps } from './FormDialogContentInner';
type Props = BaseProps & UncontrolledDialogProps;
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>;
export declare const FormDialogContent: React.VFC<Props & ElementProps>;
export {};
