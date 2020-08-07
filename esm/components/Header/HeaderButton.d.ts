import { FC, ReactNode } from 'react';
import { Props as IconProps } from '../Icon/Icon';
declare type Props = {
    icon: IconProps['name'];
    children: ReactNode;
    onClick?: () => void;
};
export declare const HeaderButton: FC<Props>;
export {};
