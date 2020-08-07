import { ComponentType, FC, ReactNode } from 'react';
import { Props as IconProps } from '../Icon';
export declare type AppNaviCustomTagProps = {
    children: ReactNode;
    tag: ComponentType<any>;
    icon?: IconProps['name'];
    current?: boolean;
} & {
    [key: string]: any;
};
declare type InnerProps = AppNaviCustomTagProps & {
    isUnclickable?: boolean;
};
export declare const AppNaviCustomTag: FC<InnerProps>;
export {};
