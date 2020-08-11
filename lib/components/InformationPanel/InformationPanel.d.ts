import React, { FC } from 'react';
import { HeadingTagTypes } from '../Heading';
declare type Props = {
    title: string;
    titleTag?: HeadingTagTypes;
    type?: 'success' | 'info' | 'warning' | 'error' | '';
    togglable?: boolean;
    openButtonLabel?: string;
    closeButtonLabel?: string;
    active?: boolean;
    className?: string;
    children: React.ReactNode;
    onClickTrigger?: (active: boolean) => void;
};
export declare const InformationPanel: FC<Props>;
export {};
