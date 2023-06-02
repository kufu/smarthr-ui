import React, { useCallback, useContext, useRef } from 'react';
import { Transition } from 'react-transition-group';
import styled from 'styled-components';
import { getIsInclude } from '../../libs/map';
import { AccordionPanelContext } from './AccordionPanel';
import { AccordionPanelItemContext } from './AccordionPanelItem';
import { useClassNames } from './useClassNames';
const duration = 200;
export const AccordionPanelContent = ({ children, className = '', ...props }) => {
    const { name } = useContext(AccordionPanelItemContext);
    const { expandedItems } = useContext(AccordionPanelContext);
    const isInclude = getIsInclude(expandedItems, name);
    const wrapperRef = useRef(null);
    const classNames = useClassNames();
    const recalculateHeight = useCallback((node) => {
        const wrapperHeight = wrapperRef.current ? wrapperRef.current.clientHeight : 0;
        node.style.height = `${wrapperHeight}px`;
    }, [wrapperRef]);
    const handleEntered = (node) => {
        node.style.height = 'auto';
        node.style.visibility = 'visible';
    };
    const handleExited = (node) => {
        node.style.height = '0px';
        node.style.visibility = 'hidden';
    };
    return (React.createElement(Transition, { in: isInclude, onEntering: recalculateHeight, onEntered: handleEntered, onExit: recalculateHeight, onExiting: recalculateHeight, onExited: handleExited, timeout: duration }, (status) => (React.createElement(CollapseContainer, { ...props, id: `${name}-content`, className: `${status} ${className} ${classNames.content}`, "aria-labelledby": `${name}-trigger`, "aria-hidden": !isInclude },
        React.createElement("div", { ref: wrapperRef }, children)))));
};
const CollapseContainer = styled.section `
  height: 0;
  overflow: hidden;
  transition: height ${duration}ms ease;
  visibility: hidden;

  &.entered {
    height: auto;
    overflow: visible;
    visibility: visible;
  }
`;
//# sourceMappingURL=AccordionPanelContent.js.map