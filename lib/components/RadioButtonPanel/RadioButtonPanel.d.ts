import React, { ComponentProps } from 'react';
import { RadioButton } from '../RadioButton';
type Props = ComponentProps<typeof RadioButton> & {
    as?: string | React.ComponentType<any>;
};
export declare const RadioButtonPanel: React.FC<Props>;
export {};
