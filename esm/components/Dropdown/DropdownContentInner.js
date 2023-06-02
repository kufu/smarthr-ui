import React, { createContext, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { DropdownCloser } from './DropdownCloser';
import { getContentBoxStyle } from './dropdownHelper';
import { useKeyboardNavigation } from './useKeyboardNavigation';
export const DropdownContentInnerContext = createContext({
    maxHeight: '',
});
export const DropdownContentInner = ({ triggerRect, scrollable, children, className, controllable, ...props }) => {
    const theme = useTheme();
    const [isActive, setIsActive] = useState(false);
    const [contentBox, setContentBox] = useState({
        top: 'auto',
        maxHeight: '',
    });
    const wrapperRef = useRef(null);
    const focusTargetRef = useRef(null);
    useEffect(() => {
        if (wrapperRef.current) {
            setContentBox(getContentBoxStyle(triggerRect, {
                width: wrapperRef.current.offsetWidth,
                height: wrapperRef.current.offsetHeight,
            }, {
                width: document.body.clientWidth,
                height: innerHeight,
            }, {
                top: scrollY,
                left: scrollX,
            }));
            setIsActive(true);
        }
    }, [triggerRect]);
    useEffect(() => {
        if (isActive) {
            focusTargetRef.current?.focus();
        }
    }, [isActive]);
    useKeyboardNavigation(wrapperRef, focusTargetRef);
    return (React.createElement(Wrapper, { ...props, ref: wrapperRef, contentBox: contentBox, className: `${className} ${isActive ? 'active' : ''}`, themes: theme },
        React.createElement("div", { tabIndex: -1, ref: focusTargetRef }),
        controllable ? (React.createElement(ControllableWrapper, { scrollable: scrollable, contentBox: contentBox }, children)) : (React.createElement(DropdownContentInnerContext.Provider, { value: { maxHeight: contentBox.maxHeight } },
            React.createElement(DropdownCloser, null, children)))));
};
const Wrapper = styled.div `
  ${({ contentBox, themes }) => {
    const { color, radius, zIndex, shadow, spacingByChar } = themes;
    const leftMargin = contentBox.left === undefined ? spacingByChar(0.5) : `max(${contentBox.left}, 0px)`;
    const rightMargin = contentBox.right === undefined ? spacingByChar(0.5) : `max(${contentBox.right}, 0px)`;
    return css `
      display: flex;
      visibility: hidden;
      z-index: ${zIndex.OVERLAP_BASE};
      position: absolute;
      top: ${contentBox.top};
      ${contentBox.left !== undefined &&
        css `
        left: ${contentBox.left};
      `}
      ${contentBox.right !== undefined &&
        css `
        right: ${contentBox.right};
      `}
      max-width: calc(100% - ${leftMargin} - ${rightMargin});
      word-break: break-word;
      border-radius: ${radius.m};
      box-shadow: ${shadow.LAYER3};
      background-color: ${color.WHITE};

      &.active {
        visibility: visible;
      }
    `;
}}
`;
const ControllableWrapper = styled.div `
  ${({ contentBox, scrollable }) => {
    return css `
      display: flex;
      flex-direction: column;
      ${contentBox.maxHeight && scrollable
        ? `
          max-height: ${contentBox.maxHeight};
          `
        : ''}
    `;
}}
`;
//# sourceMappingURL=DropdownContentInner.js.map