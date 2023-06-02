import React from 'react';
import styled, { css } from 'styled-components';
import { useSpacing } from '../../hooks/useSpacing';
import { Center } from '../Layout';
import { Td } from './Td';
export const EmptyTableBody = ({ children, padding = 4, ...props }) => {
    return (React.createElement("tbody", { ...props },
        React.createElement("tr", null,
            React.createElement(StyledTd, { colSpan: 1000, padding: padding },
                React.createElement(Center, null, children)))));
};
const StyledTd = styled(Td) `
  ${({ padding }) => {
    if (padding instanceof Object) {
        return css `
        ${padding.vertical &&
            `
          padding-top: ${useSpacing(padding.vertical)};
          padding-bottom: ${useSpacing(padding.vertical)};
        `}
        ${padding.horizontal &&
            `
          padding-left: ${useSpacing(padding.horizontal)};
          padding-right: ${useSpacing(padding.horizontal)};
        `}
      `;
    }
    else {
        return css `
        ${padding && `padding: ${useSpacing(padding)};`}
      `;
    }
}}
`;
//# sourceMappingURL=EmptyTableBody.js.map