import { FC, ReactNode } from 'react';
export declare type Option = {
    value: string;
    content: ReactNode;
    ariaLabel?: string;
    disabled?: boolean;
};
declare type Props = {
    options: Option[];
    value?: string | null;
    onClickOption?: (value: string) => void;
    size?: 'default' | 's';
    isSquare?: boolean;
    className?: string;
};
export declare const SegmentedControl: FC<Props>;
export {};
