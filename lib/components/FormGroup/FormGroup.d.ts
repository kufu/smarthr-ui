import { FC, ReactNode } from 'react';
import { Props as StatusLabelProps } from '../StatusLabel';
import { HeadingTypes } from '../Heading';
declare type innerMarginType = 'XXS' | 'XS' | 'S';
declare type Props = {
    label: string;
    labelType?: HeadingTypes;
    labelId?: string;
    innerMargin?: innerMarginType;
    statusLabels?: StatusLabelProps[];
    helpMessage?: ReactNode;
    errorMessages?: string[];
    children: ReactNode;
    disabled?: boolean;
    className?: string;
};
export declare const FormGroup: FC<Props>;
export {};
