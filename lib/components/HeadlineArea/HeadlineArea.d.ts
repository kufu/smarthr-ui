import { FC, ReactNode } from 'react';
import { Props as HeadingProps } from '../Heading';
declare type Props = {
    heading: {
        children: HeadingProps['children'];
        tag?: HeadingProps['tag'];
    };
    description?: ReactNode;
    className?: string;
};
export declare const HeadlineArea: FC<Props>;
export {};
