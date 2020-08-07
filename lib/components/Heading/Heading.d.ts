import { FC, ReactNode } from 'react';
export declare type Props = {
    children: ReactNode;
    type?: HeadingTypes;
    tag?: HeadingTagTypes;
    className?: string;
};
export declare type HeadingTypes = 'screenTitle' | 'sectionTitle' | 'blockTitle' | 'subBlockTitle' | 'subSubBlockTitle';
export declare type HeadingTagTypes = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';
export declare const Heading: FC<Props>;
