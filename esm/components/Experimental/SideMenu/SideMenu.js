import React from 'react';
import styled from 'styled-components';
import { Stack } from '../../Layout';
import { SideMenuGroup } from './SideMenuGroup';
import { SideMenuItem } from './SideMenuItem';
import { useClassNames } from './useClassNames';
export const SideMenu = ({ children, className, ...props }) => {
    const classNames = useClassNames();
    return (React.createElement(Wrapper, { ...props, className: `${className || ''} ${classNames.wrapper}` }, children));
};
SideMenu.Group = SideMenuGroup;
SideMenu.Item = SideMenuItem;
const Wrapper = styled(Stack).attrs({ as: 'ul', inline: true, gap: 0.75 }) ``;
//# sourceMappingURL=SideMenu.js.map