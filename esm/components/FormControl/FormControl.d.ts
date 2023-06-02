import React, { ComponentProps } from 'react';
import { FormGroup } from '../FormGroup';
type Props = Omit<ComponentProps<typeof FormGroup>, 'as'>;
export declare const FormControl: React.FC<Props>;
export {};
