import React, { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
const transitionClassName = 'shr-dialog-transition';
export const DialogOverlap = ({ isOpen, children }) => {
    const theme = useTheme();
    const [childrenBuffer, setChildrenBuffer] = useState(null);
    useEffect(() => {
        if (isOpen) {
            setChildrenBuffer(children);
        }
    }, [isOpen, children]);
    return (React.createElement(CSSTransition, { classNames: transitionClassName, in: isOpen, timeout: {
            appear: 500,
            enter: 300,
            exit: 300,
        }, appear: true, unmountOnExit: true },
        React.createElement(Wrapper, { themes: theme }, isOpen ? children : childrenBuffer)));
};
const Wrapper = styled.div `
  position: absolute;
  z-index: ${({ themes }) => themes.zIndex.OVERLAP_BASE};

  &.${transitionClassName}-appear {
    opacity: 0;
  }
  &.${transitionClassName}-appear-active {
    transition: opacity 500ms;
    opacity: 1;
  }
  &.${transitionClassName}-enter {
    opacity: 0;
  }
  &.${transitionClassName}-enter-active {
    transition: opacity 300ms;
    opacity: 1;
  }
  &.${transitionClassName}-exit {
    opacity: 1;
  }
  &.${transitionClassName}-exit-active {
    transition: opacity 300ms;
    opacity: 0;
  }
`;
//# sourceMappingURL=DialogOverlap.js.map