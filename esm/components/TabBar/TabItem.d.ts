import { FC, ReactNode } from 'react';
declare type Props = {
    id: string;
    children: ReactNode;
    selected?: boolean;
    disabled?: boolean;
    className?: string;
    onClick: (tabId: string) => void;
};
export declare const TabItem: FC<Props>;
export {};
