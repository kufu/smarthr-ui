import { FC, TextareaHTMLAttributes } from 'react';
declare type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    error?: boolean;
    width?: number | string;
    autoFocus?: boolean;
};
export declare const Textarea: FC<Props>;
export {};
