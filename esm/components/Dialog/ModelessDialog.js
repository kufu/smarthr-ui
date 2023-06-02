import React, { useCallback, useEffect, useMemo, useRef, useState, } from 'react';
import Draggable from 'react-draggable';
import styled, { css } from 'styled-components';
import { useHandleEscape } from '../../hooks/useHandleEscape';
import { useId } from '../../hooks/useId';
import { useTheme } from '../../hooks/useTheme';
import { Base } from '../Base';
import { Button } from '../Button';
import { FaGripHorizontalIcon, FaTimesIcon } from '../Icon';
import { DialogOverlap } from './DialogOverlap';
import { useClassNames } from './useClassNames';
import { useDialogPortal } from './useDialogPortal';
const DIALOG_HANDLER_ARIA_LABEL = 'ダイアログの位置';
const CLOSE_BUTTON_ICON_ALT = '閉じる';
export const ModelessDialog = ({ header, children, footer, isOpen, onClickClose, onPressEscape, width, height, top, left, right, bottom, portalParent, className = '', decorators, ...props }) => {
    const labelId = useId();
    const classNames = useClassNames().modelessDialog;
    const { createPortal } = useDialogPortal(portalParent);
    const theme = useTheme();
    const wrapperRef = useRef(null);
    const focusTargetRef = useRef(null);
    const [wrapperPosition, setWrapperPosition] = useState(undefined);
    const [centering, setCentering] = useState({});
    const [position, setPosition] = useState({
        x: 0,
        y: 0,
    });
    const [draggableBounds, setDraggableBounds] = useState();
    const dialogHandlerAriaLabel = useMemo(() => decorators?.dialogHandlerAriaLabel?.(DIALOG_HANDLER_ARIA_LABEL) || DIALOG_HANDLER_ARIA_LABEL, [decorators]);
    const defaultAriaValuetext = useMemo(() => wrapperPosition
        ? `上から${Math.trunc(wrapperPosition.top)}px、左から${Math.trunc(wrapperPosition.left)}px`
        : '', [wrapperPosition]);
    const dialogHandlerAriaValuetext = useMemo(() => defaultAriaValuetext
        ? decorators?.dialogHandlerAriaValuetext?.(defaultAriaValuetext, wrapperPosition) ||
            defaultAriaValuetext
        : undefined, [defaultAriaValuetext, wrapperPosition, decorators]);
    const closeButtonIconAlt = useMemo(() => decorators?.closeButtonIconAlt?.(CLOSE_BUTTON_ICON_ALT) || CLOSE_BUTTON_ICON_ALT, [decorators]);
    const topStyle = centering.top !== undefined ? centering.top : top;
    const leftStyle = centering.left !== undefined ? centering.left : left;
    const handleArrowKey = useCallback((e) => {
        if (!isOpen || document.activeElement !== e.currentTarget) {
            return;
        }
        const movingDistance = 20;
        switch (e.key) {
            case 'ArrowUp':
                setPosition((prev) => ({
                    x: prev.x,
                    y: prev.y - movingDistance,
                }));
                e.preventDefault();
                break;
            case 'ArrowDown':
                setPosition((prev) => ({
                    x: prev.x,
                    y: prev.y + movingDistance,
                }));
                e.preventDefault();
                break;
            case 'ArrowLeft':
                setPosition((prev) => ({
                    x: prev.x - movingDistance,
                    y: prev.y,
                }));
                e.preventDefault();
                break;
            case 'ArrowRight':
                setPosition((prev) => ({
                    x: prev.x + movingDistance,
                    y: prev.y,
                }));
                e.preventDefault();
                break;
        }
    }, [isOpen]);
    useEffect(() => {
        if (wrapperRef.current instanceof Element) {
            setWrapperPosition(wrapperRef.current.getBoundingClientRect());
        }
    }, [position]);
    useEffect(() => {
        // 中央寄せの座標計算を行う
        if (!wrapperRef.current || !isOpen) {
            return;
        }
        const isXCenter = left === undefined && right === undefined;
        const isYCenter = top === undefined && bottom === undefined;
        if (isXCenter || isYCenter) {
            const rect = wrapperRef.current.getBoundingClientRect();
            setCentering({
                top: isYCenter ? window.innerHeight / 2 - rect.height / 2 : undefined,
                left: isXCenter ? window.innerWidth / 2 - rect.width / 2 : undefined,
            });
        }
    }, [bottom, isOpen, left, right, top]);
    useEffect(() => {
        if (!isOpen)
            return;
        if (centering.top) {
            setDraggableBounds({ top: centering.top * -1 });
            return;
        }
        if (wrapperRef.current) {
            const rect = wrapperRef.current.getBoundingClientRect();
            setDraggableBounds({ top: rect.top * -1 });
        }
    }, [isOpen, centering.top]);
    useEffect(() => {
        if (isOpen) {
            setPosition({ x: 0, y: 0 });
            focusTargetRef.current?.focus();
        }
    }, [isOpen]);
    useHandleEscape(useCallback(() => {
        if (isOpen) {
            onPressEscape && onPressEscape();
        }
    }, [isOpen, onPressEscape]));
    return createPortal(React.createElement(DialogOverlap, { isOpen: isOpen },
        React.createElement(Draggable, { handle: `.${classNames.handle}`, onStart: (_, data) => setPosition({ x: data.x, y: data.y }), onDrag: (_, data) => {
                setPosition((prev) => {
                    return {
                        x: prev.x + data.deltaX,
                        y: prev.y + data.deltaY,
                    };
                });
            }, position: position, bounds: draggableBounds },
            React.createElement(Layout, { ...props, className: `${className} ${classNames.wrapper}`, style: {
                    top: topStyle,
                    left: leftStyle,
                    right,
                    bottom,
                    width,
                    height,
                }, ref: wrapperRef, role: "dialog", "aria-labelledby": labelId },
                React.createElement(Box, { isWidthAuto: width === undefined, left: left, right: right, themes: theme, className: classNames.box },
                    React.createElement("div", { tabIndex: -1, ref: focusTargetRef }),
                    React.createElement(Header, { className: classNames.header, themes: theme },
                        React.createElement(DialogHandler, { className: classNames.handle, themes: theme, tabIndex: 0, role: "slider", "aria-label": dialogHandlerAriaLabel, "aria-valuetext": dialogHandlerAriaValuetext, onKeyDown: handleArrowKey },
                            React.createElement(FaGripHorizontalIcon, null)),
                        React.createElement(Title, { id: labelId, themes: theme }, header),
                        React.createElement(CloseButtonLayout, null,
                            React.createElement(Button, { type: "button", size: "s", square: true, onClick: onClickClose, className: classNames.closeButton },
                                React.createElement(FaTimesIcon, { alt: closeButtonIconAlt })))),
                    React.createElement(Content, { className: classNames.content }, children),
                    footer && (React.createElement(Footer, { className: classNames.footer, themes: theme }, footer)))))));
};
const Layout = styled.div `
  position: fixed;
`;
const Box = styled(Base).attrs({ radius: 'm', layer: 3 }) `
  ${({ isWidthAuto, left = 0, right = 0, themes: { spacingByChar } }) => {
    const leftMargin = typeof left === 'number' ? `${left}px` : left;
    const rightMargin = typeof right === 'number' ? `${right}px` : right;
    return css `
      display: flex;
      flex-direction: column;
      ${isWidthAuto &&
        css `
          max-width: min(
            calc(
              100vw - max(${leftMargin}, ${spacingByChar(0.5)}) -
                max(${rightMargin}, ${spacingByChar(0.5)})
            ),
            800px
          );
        ` /* TODO: 幅の定数指定は、トークンが決まり theme に入ったら差し替える */}
      height: 100%;
      max-height: 100vh;
    `;
}}
`;
const Header = styled.div `
  ${({ themes: { color, border, spacingByChar } }) => css `
    position: relative;
    display: flex;
    align-items: center;
    padding-left: ${spacingByChar(1.5)};
    padding-right: ${spacingByChar(1)};
    border-bottom: ${border.shorthand};
    cursor: move;

    &:hover {
      background-color: ${color.hoverColor(color.WHITE)};
    }
  `}
`;
const Title = styled.div `
  ${({ themes: { spacingByChar } }) => css `
    /* DialogHandlerの上に出すためにスタッキングコンテキストを生成 */
    position: relative;
    margin: ${spacingByChar(1)} ${spacingByChar(1)} ${spacingByChar(1)} 0;
  `}
`;
const DialogHandler = styled.div `
  ${({ themes: { color, shadow, radius } }) => css `
    position: absolute;
    inset: 2px 0 0;
    margin: auto;
    border-top-right-radius: ${radius.s};
    border-top-left-radius: ${radius.s};
    color: ${color.TEXT_GREY};
    display: flex;
    justify-content: center;
    transition: color 0.1s ease;

    &:focus-visible {
      outline: none;
      box-shadow: ${shadow.OUTLINE};
      background-color: ${color.hoverColor(color.WHITE)};
    }
  `}
`;
const CloseButtonLayout = styled.div `
  /* DialogHandlerの上に出すためにスタッキングコンテキストを生成 */
  position: relative;
  flex-shrink: 0;
  margin-left: auto;
`;
const Content = styled.div `
  flex: 1;
  overflow: auto;
  overscroll-behavior: contain;
`;
const Footer = styled.div `
  ${({ themes: { border } }) => css `
    border-top: ${border.shorthand};
  `}
`;
//# sourceMappingURL=ModelessDialog.js.map