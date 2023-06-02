import React from 'react';
import styled, { css } from 'styled-components';
import { useClassNames } from './useClassNames';
import { useReelCells } from './useReelCells';
import { useReelShadow } from './useReelShadow';
export const TableReel = ({ children, className = '', ...props }) => {
    const { showShadow, tableWrapperRef } = useReelCells();
    const classNames = useClassNames();
    return (React.createElement(Wrapper, { showShadow: showShadow, className: `${className} ${classNames.tableReel.wrapper}` },
        React.createElement(Inner, { ...props, ref: tableWrapperRef, className: classNames.tableReel.inner }, children)));
};
const Wrapper = styled.div `
  ${({ showShadow }) => css `
    position: relative;

    ${useReelShadow({ showShadow })}
  `}
`;
const Inner = styled.div `
  position: relative;
  overflow: auto;
`;
//# sourceMappingURL=TableReel.js.map