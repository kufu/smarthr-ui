import React, { ButtonHTMLAttributes } from 'react';
import { BaseProps } from './types';
type ElementProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>;
export declare const Button: React.ForwardRefExoticComponent<BaseProps & ElementProps & React.RefAttributes<HTMLButtonElement>>;
export {};
