import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../Button';
export const PaginationItem = ({ page, currentPage, onClick }) => {
    const theme = useTheme();
    if (page === currentPage) {
        return (React.createElement(ItemButton, { className: "active", themes: theme, "aria-current": "page", "aria-label": `${page}ページ目`, disabled: true }, page));
    }
    return (React.createElement(ItemButton, { onClick: () => onClick(page), themes: theme, "aria-label": `${page}ページ目` }, page));
};
export const ItemButton = styled(Button).attrs({
    square: true,
    size: 's',
}) `
  ${({ themes: { color, radius } }) => css `
      border-radius: ${radius.s};
      &.active {
        cursor: default;
        outline: none;
        border: 1px solid ${color.MAIN};
        background-color: ${color.MAIN};
        color: ${color.TEXT_WHITE};
      }
    `}
`;
//# sourceMappingURL=PaginationItem.js.map