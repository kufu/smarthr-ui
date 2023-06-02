import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';
import { useEnhancedEffect } from '../../hooks/useEnhancedEffect';
import { useId } from '../../hooks/useId';
import { useTheme } from '../../hooks/useTheme';
import { TooltipPortal } from './TooltipPortal';
import { useClassNames } from './useClassNames';
export const Tooltip = ({ message, children, triggerType, multiLine, ellipsisOnly = false, horizontal = 'left', vertical = 'bottom', tabIndex = 0, ariaDescribedbyTarget = 'wrapper', portalRootElement, className = '', onPointerEnter, onPointerLeave, onTouchStart, onTouchEnd, onFocus, onBlur, ...props }) => {
    const [portalRoot, setPortalRoot] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [rect, setRect] = useState(null);
    const ref = useRef(null);
    const tooltipId = useId();
    const getHandlerToShow = (handler) => {
        return (e) => {
            handler && handler(e);
            if (!ref.current) {
                return;
            }
            if (ellipsisOnly) {
                const outerWidth = parseInt(window
                    .getComputedStyle(ref.current.parentNode, null)
                    .width.match(/\d+/)[0], 10);
                const wrapperWidth = ref.current.clientWidth;
                const existsEllipsis = outerWidth >= 0 && outerWidth <= wrapperWidth;
                if (!existsEllipsis) {
                    return;
                }
            }
            setRect(ref.current.getBoundingClientRect());
            setIsVisible(true);
        };
    };
    const getHandlerToHide = (handler) => {
        return (e) => {
            handler && handler(e);
            setIsVisible(false);
        };
    };
    const isIcon = triggerType === 'icon';
    useEnhancedEffect(() => {
        let element;
        if (portalRootElement) {
            element = portalRootElement;
        }
        else {
            element = document.createElement('div');
            document.body.appendChild(element);
        }
        setPortalRoot(element);
        return () => {
            if (portalRootElement)
                return;
            document.body.removeChild(element);
        };
    }, [portalRootElement]);
    const theme = useTheme();
    const classNames = useClassNames();
    const childrenWithProps = ariaDescribedbyTarget === 'inner'
        ? React.cloneElement(children, { 'aria-describedby': tooltipId })
        : children;
    return (React.createElement(Wrapper, { ...props, "aria-describedby": ariaDescribedbyTarget === 'wrapper' ? tooltipId : undefined, ref: ref, onPointerEnter: getHandlerToShow(onPointerEnter), onTouchStart: getHandlerToShow(onTouchStart), onFocus: getHandlerToShow(onFocus), onPointerLeave: getHandlerToHide(onPointerLeave), onTouchEnd: getHandlerToHide(onTouchEnd), onBlur: getHandlerToHide(onBlur), isIcon: isIcon, tabIndex: tabIndex, className: `${className} ${classNames.wrapper}`, themes: theme },
        portalRoot &&
            createPortal(React.createElement(TooltipPortal, { message: message, id: tooltipId, isVisible: isVisible, parentRect: rect, isIcon: isIcon, isMultiLine: multiLine, horizontal: horizontal, vertical: vertical }), portalRoot),
        childrenWithProps));
};
const Wrapper = styled.span `
  ${({ isIcon, themes: { shadow } }) => css `
    display: inline-block;
    max-width: 100%;
    overflow-y: hidden;

    /* inline-block に overflow: visible 以外を指定すると、vertical-align が bottom margin edge に揃ってしまう
     * https://ja.stackoverflow.com/questions/2603/ */
    vertical-align: bottom;

    ${isIcon &&
    css `
      line-height: 0;
    `}

    &:focus-visible {
      ${shadow.focusIndicatorStyles}
    }
  `}
`;
//# sourceMappingURL=Tooltip.js.map