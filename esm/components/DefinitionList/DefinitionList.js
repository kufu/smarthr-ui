import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { Cluster } from '../Layout';
import { DefinitionListItem } from './DefinitionListItem';
import { useClassNames } from './useClassNames';
export const DefinitionList = ({ items, layout = 'single', className = '', }) => {
    const theme = useTheme();
    const classNames = useClassNames();
    return (React.createElement(Wrapper, { className: `${className} ${classNames.definitionList.wrapper}` }, items.map(({ term, description, className: itemClassName }, index) => (React.createElement(Item, { term: term, description: description, key: index, layout: layout, className: itemClassName, themes: theme })))));
};
const column = (layout) => {
    switch (layout) {
        case 'single':
            return 1;
        case 'double':
            return 2;
        case 'triple':
            return 3;
    }
};
const Wrapper = styled(Cluster).attrs({ as: 'dl', gap: 1.5 }) `
  margin-block: initial;
`;
const Item = styled(DefinitionListItem) `
  ${({ layout, themes: { space } }) => {
    const $columns = column(layout);
    return css `
      flex-basis: calc((100% - (${space(1.5)} * ${$columns - 1})) / ${$columns});
      flex-shrink: 1;
    `;
}}
`;
//# sourceMappingURL=DefinitionList.js.map