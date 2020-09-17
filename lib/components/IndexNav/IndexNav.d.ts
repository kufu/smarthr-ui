import { FC } from 'react';
declare type Props = {
    items: IndexNavItemProps[];
};
export declare type IndexNavItemProps = {
    label: string;
    href: string;
    children?: IndexNavItemProps[];
    current?: boolean;
};
export declare const IndexNav: FC<Props>;
export {};
