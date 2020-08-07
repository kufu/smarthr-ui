import { FC, ReactNode } from 'react';
import { Props as InputProps } from '../Input';
import { HeadingTagTypes, HeadingTypes } from '../Heading';
declare type Props = Omit<InputProps, 'error'> & {
    label: string;
    labelType?: HeadingTypes;
    labelTagType?: HeadingTagTypes;
    errorMessage?: string | string[];
    helpMessage?: string;
    labelSuffix?: ReactNode;
    className?: string;
};
export declare const FieldSet: FC<Props>;
export {};
