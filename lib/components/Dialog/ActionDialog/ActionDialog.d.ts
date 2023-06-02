import React, { HTMLAttributes } from 'react';
import { DialogProps } from '../types';
import { ActionDialogContentInnerProps } from './ActionDialogContentInner';
type Props = Omit<ActionDialogContentInnerProps, 'titleId'> & DialogProps;
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>;
export declare const ActionDialog: React.VFC<Props & ElementProps>;
export {};
