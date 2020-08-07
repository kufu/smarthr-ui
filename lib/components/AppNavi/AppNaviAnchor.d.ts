import { FC, ReactNode } from 'react';
import { Props as IconProps } from '../Icon';
export declare type AppNaviAnchorProps = {
    children: ReactNode;
    href: string;
    icon?: IconProps['name'];
    current?: boolean;
};
declare type InnerProps = AppNaviAnchorProps & {
    isUnclickable?: boolean;
};
export declare const AppNaviAnchor: FC<InnerProps>;
export {};
