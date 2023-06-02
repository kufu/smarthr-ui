import React, { useCallback, useRef } from 'react';
import styled, { css } from 'styled-components';
import { useHandleEscape } from '../../hooks/useHandleEscape';
import { useTheme } from '../../hooks/useTheme';
import { BodyScrollSuppressor } from './BodyScrollSuppressor';
import { DialogOverlap } from './DialogOverlap';
import { DialogPositionProvider } from './DialogPositionProvider';
import { FocusTrap } from './FocusTrap';
import { useClassNames } from './useClassNames';
function exist(value) {
    return value !== undefined && value !== null;
}
export const DialogContentInner = ({ onClickOverlay, onPressEscape = () => {
    /* noop */
}, isOpen, id, width, firstFocusTarget, ariaLabel, ariaLabelledby, children, className = '', ...props }) => {
    const classNames = useClassNames().dialog;
    const theme = useTheme();
    const innerRef = useRef(null);
    useHandleEscape(useCallback(() => {
        if (!isOpen) {
            return;
        }
        onPressEscape();
    }, [isOpen, onPressEscape]));
    const handleClickOverlay = useCallback(() => {
        if (!isOpen) {
            return;
        }
        onClickOverlay && onClickOverlay();
    }, [isOpen, onClickOverlay]);
    return (React.createElement(DialogPositionProvider, { top: props.top, bottom: props.bottom },
        React.createElement(DialogOverlap, { isOpen: isOpen },
            React.createElement(Layout, { className: classNames.wrapper, id: id },
                React.createElement(Background, { onClick: handleClickOverlay, themes: theme, className: classNames.background }),
                React.createElement(Inner, { ...props, "$width": width, ref: innerRef, themes: theme, role: "dialog", "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby, "aria-modal": "true", className: `${className} ${classNames.dialog}` },
                    React.createElement(FocusTrap, { firstFocusTarget: firstFocusTarget }, children)),
                React.createElement(BodyScrollSuppressor, null)))));
};
const Layout = styled.div `
  position: fixed;
  inset: 0;
`;
const Inner = styled.div `
  ${({ themes, $width, top, right, bottom, left }) => {
    const { border, color, radius, shadow, space } = themes;
    const positionRight = exist(right) ? `${right}px` : 'auto';
    const positionBottom = exist(bottom) ? `${bottom}px` : 'auto';
    const positionTop = exist(top) ? `${top}px` : 'auto';
    const positionLeft = exist(left) ? `${left}px` : 'auto';
    const translateX = exist(right) || exist(left) ? '0' : 'calc((100vw - 100%) / 2)';
    const translateY = exist(top) || exist(bottom) ? '0' : 'calc((100vh - 100%) / 2)';
    return css `
      position: absolute;
      inset: ${positionTop} ${positionRight} ${positionBottom} ${positionLeft};
      ${exist($width) &&
        css `
        width: ${typeof $width === 'number' ? `${$width}px` : $width};
      `}
      /* viewport を超えないように上限設定 */
      max-width: min(
        calc(100vw - max(${left || 0}px, ${space(0.5)}) - max(${right || 0}px, ${space(0.5)})),
        /* TODO: 幅の定数指定は、トークンが決まり theme に入ったら差し替える */
        800px
      );
      border-radius: ${radius.m};
      background-color: ${color.WHITE};
      box-shadow: ${shadow.LAYER3};
      transform: translate(${translateX}, ${translateY});

      @media (prefers-contrast: more) {
        & {
          border: ${border.highContrast};
        }
      }
    `;
}}
`;
const Background = styled.div `
  ${({ themes }) => {
    return css `
      position: fixed;
      inset: 0;
      background-color: ${themes.color.SCRIM};
    `;
}}
`;
//# sourceMappingURL=DialogContentInner.js.map