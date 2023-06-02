import { ComponentProps, FC, PropsWithChildren } from 'react';
import { Stack } from '../../Layout';
import { SideMenuGroup } from './SideMenuGroup';
import { SideMenuItem } from './SideMenuItem';
type Props = PropsWithChildren;
type ElementProps = ComponentProps<typeof Stack>;
type SubComponents = {
    Group: typeof SideMenuGroup;
    Item: typeof SideMenuItem;
};
export declare const SideMenu: FC<Props & ElementProps> & SubComponents;
export {};
