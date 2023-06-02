import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { Reel } from '../Layout';
import { useClassNames } from './useClassNames';
export const TabBar = ({ className = '', bordered = true, children, ...props }) => {
    const theme = useTheme();
    const classNames = useClassNames().tabBar;
    const wrapperClass = `${className} ${classNames.wrapper}`;
    return (React.createElement(Reel, { ...props, role: "tablist", className: wrapperClass },
        React.createElement(Inner, { className: bordered ? 'bordered' : undefined, themes: theme }, children)));
};
const Inner = styled.div `
  ${({ themes }) => {
    const { border, shadow } = themes;
    return css `
      flex-grow: 1;
      margin: ${shadow.OUTLINE_MARGIN};

      &.bordered {
        position: relative;

        ::before {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          border-bottom: ${border.shorthand};
          content: '';
        }
      }
    `;
}}
`;
//# sourceMappingURL=TabBar.js.map