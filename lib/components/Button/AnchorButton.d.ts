import React, { AnchorHTMLAttributes } from 'react';
import { BaseProps } from './types';
type ElementProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps>;
export declare const AnchorButton: React.ForwardRefExoticComponent<BaseProps & ElementProps & React.RefAttributes<HTMLAnchorElement>>;
export {};
