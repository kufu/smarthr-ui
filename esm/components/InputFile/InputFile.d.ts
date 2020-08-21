import { FC, InputHTMLAttributes } from 'react';
declare type Size = 'default' | 's';
export declare type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
    id?: string;
    className?: string;
    size?: Size;
    label: string;
    files?: File[];
    onAdd?: (addFiles: File[]) => void;
    onDelete?: (index: number) => void;
    hasFileList?: boolean;
};
export declare const InputFile: FC<Props>;
export {};
