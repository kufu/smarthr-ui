import React, { useContext } from 'react';
import styled, { css } from 'styled-components';
import { DropdownContentContext } from './DropdownContent';
import { DropdownContentInnerContext } from './DropdownContentInner';
import { useClassNames } from './useClassNames';
export const DropdownCloser = ({ children, className = '' }) => {
    const { onClickCloser, controllable, scrollable } = useContext(DropdownContentContext);
    const { maxHeight } = useContext(DropdownContentInnerContext);
    const classNames = useClassNames();
    return (React.createElement(Wrapper, { className: `${className} ${classNames.closer}`, onClick: onClickCloser, maxHeight: maxHeight, controllable: controllable, scrollable: scrollable }, children));
};
const Wrapper = styled.div `
  ${({ maxHeight, controllable, scrollable }) => {
    return css `
      ${!controllable
        ? `
      display: flex;
      flex-direction: column;
      `
        : ''}
      ${!controllable && scrollable ? `max-height: ${maxHeight};` : ''}
    `;
}}
`;
//# sourceMappingURL=DropdownCloser.js.map