import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { Cluster } from '../Layout';
import { Text } from '../Text';
export const PageCounter = ({ start, end, total = 0 }) => {
    const theme = useTheme();
    return (React.createElement(Wrapper, { themes: theme },
        total > 0 && (React.createElement(Wrapper, { as: "span", gap: 0.25, themes: theme },
            React.createElement(Bold, null, total.toLocaleString()),
            "\u4EF6\u4E2D")),
        React.createElement(Wrapper, { as: "span", gap: 0.25, themes: theme },
            React.createElement(Bold, null, start.toLocaleString()),
            "\u2013",
            React.createElement(Bold, null, end.toLocaleString()),
            "\u4EF6")));
};
const Wrapper = styled(Cluster).attrs({ align: 'baseline', inline: true }) `
  ${({ themes: { fontSize } }) => css `
    font-size: ${fontSize.M};
  `}
`;
const Bold = styled(Text).attrs({ weight: 'bold', forwardedAs: 'b' }) ``;
//# sourceMappingURL=PageCounter.js.map