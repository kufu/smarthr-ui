import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { isTouchDevice } from '../../libs/ua';
import { UnstyledButton } from '../Button';
import { useClassNames } from './useClassNames';
export const SideNavItem = ({ id, title, prefix, isSelected = false, size, onClick, }) => {
    const theme = useTheme();
    const classNames = useClassNames();
    const handleClick = onClick
        ? (e) => onClick(e, id)
        : undefined;
    const itemClassName = `${isSelected ? 'selected' : ''} ${classNames.item}`;
    return (React.createElement(Wrapper, { className: itemClassName, themes: theme },
        React.createElement(Button, { className: size, themes: theme, onClick: handleClick },
            prefix && React.createElement(PrefixWrapper, { themes: theme }, prefix),
            React.createElement("span", { className: classNames.itemTitle }, title))));
};
const Wrapper = styled.li `
  ${({ themes }) => {
    const { color, interaction } = themes;
    return css `
      color: ${color.TEXT_BLACK};
      transition: ${isTouchDevice
        ? 'none'
        : `background-color ${interaction.hover.animation}, color ${interaction.hover.animation}`};

      &:hover {
        background-color: ${color.hoverColor(color.COLUMN)};
      }

      &.selected {
        background-color: ${color.MAIN};
        color: ${color.TEXT_WHITE};
        position: relative;

        &::after {
          position: absolute;
          top: 50%;
          right: -4px;
          transform: translate(0, -50%);
          border-style: solid;
          border-width: 4px 0 4px 4px;
          border-color: transparent transparent transparent ${color.MAIN};
          content: '';
        }
      }
    `;
}}
`;
const Button = styled(UnstyledButton) `
  ${({ themes }) => {
    const { fontSize, shadow, spacingByChar } = themes;
    return css `
      outline: none;
      width: 100%;
      line-height: 1;
      box-sizing: border-box;
      cursor: pointer;

      &.default {
        padding: ${spacingByChar(1)};
        font-size: ${fontSize.M};
      }

      &.s {
        padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
        font-size: ${fontSize.S};
      }

      &:focus-visible {
        ${shadow.focusIndicatorStyles}
      }
    `;
}}
`;
const PrefixWrapper = styled.span `
  ${({ themes: { spacingByChar } }) => {
    return css `
      margin-right: ${spacingByChar(0.5)};
    `;
}}
`;
//# sourceMappingURL=SideNavItem.js.map