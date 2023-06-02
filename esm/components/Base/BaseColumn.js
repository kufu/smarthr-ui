import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { Base as shrBase } from './Base';
export const BaseColumn = ({ padding = 1, ...props }) => {
    const themes = useTheme();
    return React.createElement(Base, { ...props, padding: padding, layer: 0, themes: themes });
};
const Base = styled(shrBase) `
  ${({ bgColor = 'COLUMN', themes: { color } }) => css `
    border-radius: unset;

    ${bgColor &&
    css `
      background-color: ${color[bgColor]};
    `}
  `}
`;
//# sourceMappingURL=BaseColumn.js.map