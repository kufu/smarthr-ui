import React, { HTMLAttributes } from 'react';
import { DialogProps } from '../types';
import { FormDialogContentInnerProps } from './FormDialogContentInner';
type Props = Omit<FormDialogContentInnerProps, 'titleId'> & DialogProps;
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>;
export declare const FormDialog: React.VFC<Props & ElementProps>;
export {};
