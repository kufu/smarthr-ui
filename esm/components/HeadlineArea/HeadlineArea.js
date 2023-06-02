import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { Heading } from '../Heading';
import { useClassNames } from './useClassNames';
/**
 * @deprecated `HeadlineArea` は非推奨です。`Stack` で書き換えてください。
 */
export const HeadlineArea = ({ heading, description, className = '', ...props }) => {
    const theme = useTheme();
    const classNames = useClassNames();
    return (React.createElement(Wrapper, { ...props, theme: theme, className: `${className} ${classNames.wrapper}` },
        React.createElement(Heading, { type: "screenTitle", tag: heading.tag ? heading.tag : 'h1' }, heading.children),
        description && (React.createElement(Description, { themes: theme, className: classNames.description }, description))));
};
const Wrapper = styled.div `
  display: block;
  margin: 0;
  padding: 0;
`;
const Description = styled.div `
  ${({ themes }) => {
    const { fontSize, spacingByChar, color } = themes;
    return css `
      margin-top: ${spacingByChar(1)};
      color: ${color.TEXT_BLACK};
      font-size: ${fontSize.M};
      line-height: 1.5;
    `;
}}
`;
//# sourceMappingURL=HeadlineArea.js.map