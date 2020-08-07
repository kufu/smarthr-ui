import { FC, ReactNode } from 'react';
declare type Props = {
    title?: ReactNode;
    links?: Array<{
        label: string;
        url: string;
        target?: string;
    }>;
    className?: string;
};
export declare const MessageScreen: FC<Props>;
export {};
