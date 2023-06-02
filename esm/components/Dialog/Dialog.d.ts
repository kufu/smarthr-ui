import React, { HTMLAttributes } from 'react';
import { DialogProps, DireactChildren } from './types';
type Props = DialogProps & DireactChildren;
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>;
export declare const Dialog: React.VFC<Props & ElementProps>;
export {};
