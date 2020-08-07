import { FC, ReactNode } from 'react';
import { Props as IconProps } from '../Icon';
export declare type AppNaviDropdownProps = {
    children: ReactNode;
    dropdownContent: ReactNode;
    icon?: IconProps['name'];
    current?: boolean;
};
declare type InnerProps = AppNaviDropdownProps & {
    isUnclickable?: boolean;
};
export declare const AppNaviDropdown: FC<InnerProps>;
export {};
