import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { useClassNames } from './useClassNames';
const BackgroundJobsList = ({ children, className = '' }) => {
    const themes = useTheme();
    const { backgroundJobsList: classNames } = useClassNames();
    return (React.createElement(List, { themes: themes, className: `${className} ${classNames.wrapper}` }, children));
};
const Item = styled.li ``;
const List = styled.ul(({ themes: { spacingByChar } }) => {
    return css `
    position: fixed;
    bottom: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin: ${spacingByChar(1)};
    list-style: none;

    ${Item} {
      :not(:first-child) {
        margin-top: ${spacingByChar(1)};
      }
    }
  `;
});
const ListAndItem = Object.assign(BackgroundJobsList, {
    Item,
});
export { ListAndItem as BackgroundJobsList };
//# sourceMappingURL=BackgroundJobsList.js.map