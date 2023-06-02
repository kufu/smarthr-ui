import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { useBulkActionRowClassNames } from './useClassNames';
export const BulkActionRow = ({ className = '', children, ...props }) => {
    const themes = useTheme();
    const classNames = useBulkActionRowClassNames();
    return (React.createElement("tr", { ...props, className: `${className} ${classNames.wrapper}` },
        React.createElement(Cell, { colSpan: 1000, themes: themes }, children)));
};
const Cell = styled.td(({ themes }) => {
    const { fontSize, border, color, spacingByChar } = themes;
    return css `
    border-top: ${border.shorthand};
    background-color: ${color.ACTION_BACKGROUND};
    padding: ${spacingByChar(1)};
    font-size: ${fontSize.M};
  `;
});
//# sourceMappingURL=BulkActionRow.js.map