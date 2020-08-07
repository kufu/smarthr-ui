import { FC, ReactNode } from 'react';
import { AppNaviButtonProps } from './AppNaviButton';
import { AppNaviAnchorProps } from './AppNaviAnchor';
import { AppNaviDropdownProps } from './AppNaviDropdown';
import { AppNaviCustomTagProps } from './AppNaviCustomTag';
interface Props {
    label?: string;
    buttons?: Array<AppNaviButtonProps | AppNaviAnchorProps | AppNaviDropdownProps | AppNaviCustomTagProps>;
    isCurrentUnclickable?: boolean;
    children?: ReactNode;
}
export declare const AppNavi: FC<Props>;
export {};
