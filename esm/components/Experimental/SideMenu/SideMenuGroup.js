import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../../hooks/useTheme';
import { Stack } from '../../Layout';
import { Text } from '../../Text';
import { useClassNames } from './useClassNames';
export const SideMenuGroup = ({ name, nameTag = 'h3', children, className, ...props }) => {
    const theme = useTheme();
    const classNames = useClassNames();
    return (React.createElement(Group, { ...props, themes: theme, className: `${className || ''} ${classNames.group}` },
        React.createElement(GroupName, { forwardedAs: nameTag, themes: theme }, name),
        React.createElement(SideMenuList, null, children)));
};
const Group = styled(Stack).attrs({ as: 'li', gap: 0.5 }) `
  ${({ themes: { border, space } }) => css `
    & + & {
      border-top: ${border.shorthand};
      padding-block-start: ${space(1.25)};
    }
  `}
`;
const GroupName = styled(Text).attrs({ color: 'TEXT_GREY', leading: 'TIGHT', size: 'S' }) ``;
const SideMenuList = styled(Stack).attrs({ as: 'ul', gap: 0 }) ``;
//# sourceMappingURL=SideMenuGroup.js.map