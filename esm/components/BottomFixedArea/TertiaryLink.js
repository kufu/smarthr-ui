import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { useClassNames } from './useClassNames';
export const TertiaryLink = ({ text, icon: Icon, type = 'button', onClick, ...props }) => {
    const theme = useTheme();
    const classNames = useClassNames();
    return (React.createElement(Button, { ...props, onClick: onClick, themes: theme, type: type, className: classNames.tertiaryLink },
        Icon && React.createElement(Icon, null),
        React.createElement(Text, { themes: theme }, text)));
};
const resetButtonStyle = css `
  background-color: transparent;
  border: none;
  padding: 0;
  appearance: none;
`;
const Button = styled.button `
  ${resetButtonStyle}
  ${({ themes }) => {
    const { spacingByChar } = themes;
    return css `
      color: ${themes.color.TEXT_LINK};
      display: flex;
      align-items: center;

      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }

      > svg {
        margin-right: ${spacingByChar(0.25)};
      }
    `;
}}
`;
const Text = styled.span `
  ${({ themes: { fontSize } }) => {
    return css `
      margin: 0;
      font-size: ${fontSize.L};
    `;
}}
`;
//# sourceMappingURL=TertiaryLink.js.map