import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { isTouchDevice } from '../../libs/ua';
import { useClassNames } from './useClassNames';
export const TabItem = ({ id, children, onClick, selected = false, className = '', disabled = false, ...props }) => {
    const theme = useTheme();
    const classNames = useClassNames().tabItem;
    const wrapperClass = `${className} ${selected ? 'selected' : ''} ${classNames.wrapper}`;
    return (React.createElement(ItemButton, { ...props, role: "tab", "aria-selected": selected, className: wrapperClass, onClick: () => onClick(id), disabled: disabled, themes: theme, type: "button" }, children));
};
const resetButtonStyle = css `
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  appearance: none;
`;
const ItemButton = styled.button `
  ${resetButtonStyle}
  ${({ themes }) => {
    const { fontSize, spacingByChar, color, interaction } = themes;
    return css `
      font-weight: bold;
      font-size: ${fontSize.M};
      color: ${color.TEXT_GREY};
      height: 40px;
      border-bottom: solid 3px transparent;
      padding: 0 ${spacingByChar(1.5)};
      box-sizing: border-box;
      transition: ${isTouchDevice
        ? 'none'
        : `background-color ${interaction.hover.animation}, color ${interaction.hover.animation}`};

      &.selected {
        position: relative;
        color: ${color.TEXT_BLACK};
        border-color: ${color.MAIN};
      }

      :hover {
        background-color: ${color.COLUMN};
        color: ${color.TEXT_BLACK};
      }

      :disabled {
        background-color: transparent;
        color: ${color.disableColor(color.TEXT_GREY)};
        cursor: not-allowed;
      }
    `;
}}
`;
//# sourceMappingURL=TabItem.js.map