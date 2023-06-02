import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { Stack } from '../Layout';
import { Text } from '../Text';
import { useClassNames } from './useClassNames';
export const DefinitionListItem = ({ term, description, className = '', }) => {
    const theme = useTheme();
    const { definitionListItem } = useClassNames();
    return (React.createElement(Wrapper, { themes: theme, className: `${className} ${definitionListItem.wrapper}` },
        React.createElement(Term, { className: definitionListItem.term }, term),
        React.createElement(Description, { themes: theme, className: definitionListItem.description }, description)));
};
const Wrapper = styled(Stack).attrs({ gap: 0.25 }) `
  ${({ themes: { border } }) => css `
    border-bottom: ${border.shorthand};
    border-bottom-style: dotted;

    @media (prefers-contrast: more) {
      & {
        border-bottom: ${border.highContrast};
      }
    }
  `}
`;
const Term = styled(Text).attrs({
    forwardedAs: 'dt',
    size: 'S',
    weight: 'bold',
    color: 'TEXT_GREY',
    leading: 'TIGHT',
}) ``;
const Description = styled(Text).attrs({
    forwardedAs: 'dd',
    size: 'M',
    color: 'TEXT_BLACK',
    leading: 'NORMAL',
}) `
  ${({ themes: { leading, space } }) => css `
    margin-inline-start: initial;
    padding-bottom: ${space(0.25)};
    min-height: ${leading.NORMAL}em;
  `}
`;
//# sourceMappingURL=DefinitionListItem.js.map