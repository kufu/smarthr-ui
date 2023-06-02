import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { SideNavItem } from './SideNavItem';
import { useClassNames } from './useClassNames';
export const SideNav = ({ items, size = 'default', onClick, className = '', ...props }) => {
    const theme = useTheme();
    const classNames = useClassNames();
    return (React.createElement(Wrapper, { ...props, themes: theme, className: `${className} ${classNames.wrapper}` }, items.map((item) => (React.createElement(SideNavItem, { id: item.id, title: item.title, prefix: item.prefix, isSelected: item.isSelected, size: size, key: item.id, onClick: onClick })))));
};
const Wrapper = styled.ul `
  ${({ themes }) => {
    const { color } = themes;
    return css `
      background-color: ${color.COLUMN};
      list-style: none;
      padding: 0;
    `;
}}
`;
//# sourceMappingURL=SideNav.js.map