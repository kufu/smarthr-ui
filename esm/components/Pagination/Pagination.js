import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { range } from '../../libs/lodash';
import { Reel } from '../Layout';
import { PaginationControllerItem } from './PaginationControllerItem';
import { PaginationItem } from './PaginationItem';
import { useClassNames } from './useClassNames';
export const Pagination = ({ total, current, onClick, padding = 4, className = '', withoutNumbers = false, ...props }) => {
    const theme = useTheme();
    const classNames = useClassNames();
    if (total <= 1)
        return null;
    const prevPage = (React.createElement(React.Fragment, null,
        React.createElement("li", { className: classNames.first },
            React.createElement(PaginationControllerItem, { onClick: onClick, direction: "prev", targetPage: 1, disabled: current === 1, double: true })),
        React.createElement("li", { className: classNames.prev },
            React.createElement(PaginationControllerItem, { onClick: onClick, direction: "prev", targetPage: current - 1, disabled: current === 1 }))));
    const pages = !withoutNumbers
        ? [
            ...range(current - padding, current).filter((page) => page >= 1),
            ...range(current, current + padding + 1).filter((page) => page <= total),
        ].map((page) => (React.createElement("li", { key: `pagination-${page}`, className: page === current ? classNames.current : classNames.page },
            React.createElement(PaginationItem, { page: page, currentPage: current, onClick: onClick }))))
        : null;
    const nextPage = (React.createElement(React.Fragment, null,
        React.createElement("li", { className: classNames.next },
            React.createElement(PaginationControllerItem, { onClick: onClick, direction: "next", targetPage: current + 1, disabled: current === total })),
        React.createElement("li", { className: classNames.last },
            React.createElement(PaginationControllerItem, { onClick: onClick, direction: "next", targetPage: total, disabled: current === total, double: true }))));
    return (React.createElement(Wrapper, { ...props, className: `${className} ${classNames.wrapper}`, "aria-label": "\u30DA\u30FC\u30B8\u30CD\u30FC\u30B7\u30E7\u30F3" },
        React.createElement(Reel, null,
            React.createElement(List, { className: withoutNumbers ? 'withoutNumbers' : '', themes: theme },
                prevPage,
                pages,
                nextPage))));
};
const Wrapper = styled.nav `
  display: inline-block;
  max-width: 100%;
`;
const List = styled.ul `
  ${({ themes: { spacingByChar, shadow } }) => {
    const classNames = useClassNames();
    return css `
      display: flex;
      align-items: center;
      margin: ${shadow.OUTLINE_MARGIN};
      padding: 0;
      > li {
        list-style: none;
        :not(:first-child) {
          margin-left: ${spacingByChar(0.5)};
        }
      }
      &:not(.withoutNumbers) {
        > li {
          &.${classNames.prev} + li {
            margin-left: ${spacingByChar(1)};
          }
          &.${classNames.next} {
            margin-left: ${spacingByChar(1)};
          }
        }
      }
      &.withoutNumbers {
        > li {
          &.${classNames.prev} {
            margin-left: ${spacingByChar(1)};
          }
          &.${classNames.last} {
            margin-left: ${spacingByChar(1)};
          }
        }
      }
    `;
}}
`;
//# sourceMappingURL=Pagination.js.map