import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { SpreadsheetTableCorner } from './SpreadsheetTableCorner';
export const SpreadsheetTable = ({ data, children }) => {
    const theme = useTheme();
    return (React.createElement(Wrapper, { themes: theme },
        data && (React.createElement(React.Fragment, null,
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement(SpreadsheetTableCorner, null),
                    data[0].map((_, i) => (React.createElement("th", { key: `headRow-${i}` }, String.fromCharCode(65 + i)))))),
            React.createElement("tbody", null, data.map((row, i) => (React.createElement("tr", { key: `bodyRow-${i}` },
                React.createElement("th", null, i + 1),
                row.map((cell, j) => (React.createElement("td", { key: `bodyCell-${i}-${j}` }, cell))))))))),
        children));
};
const Wrapper = styled.table `
  ${({ themes: { border, color, fontSize, leading, space } }) => css `
    border-collapse: collapse;
    border: ${border.shorthand};
    background-color: ${color.HEAD};

    th,
    td {
      padding: ${space(0.25)};
      font-size: ${fontSize.S};
    }

    th {
      font-weight: normal;
      color: ${color.TEXT_GREY};
    }

    th + th {
      border-inline-start: 1px solid ${color.hoverColor(color.HEAD)};
    }

    tr + tr th {
      border-block-start: 1px solid ${color.hoverColor(color.HEAD)};
      width: calc(1em * ${leading.NORMAL});
    }

    td {
      border: ${border.shorthand};
      background-color: ${color.WHITE};
    }
  `}
`;
//# sourceMappingURL=SpreadsheetTable.js.map