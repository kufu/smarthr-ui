import { CSSProperties } from 'react';
export declare type FineSize = 'xs' | 's' | 'm' | 'l' | 'xl';
export declare type Size = 's' | 'm' | 'l';
export interface ComponentProps {
    pcSize?: Size;
    tabletSize?: Size;
    spSize?: Size;
    className?: string;
    style?: CSSProperties;
    children?: React.ReactNode;
}
export interface StyledProperties {
    pcSize?: Size;
    tabletSize?: Size;
    spSize?: Size;
}
