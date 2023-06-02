"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelessDialog = void 0;
const react_1 = __importStar(require("react"));
const react_draggable_1 = __importDefault(require("react-draggable"));
const styled_components_1 = __importStar(require("styled-components"));
const useHandleEscape_1 = require("../../hooks/useHandleEscape");
const useId_1 = require("../../hooks/useId");
const useTheme_1 = require("../../hooks/useTheme");
const Base_1 = require("../Base");
const Button_1 = require("../Button");
const Icon_1 = require("../Icon");
const DialogOverlap_1 = require("./DialogOverlap");
const useClassNames_1 = require("./useClassNames");
const useDialogPortal_1 = require("./useDialogPortal");
const DIALOG_HANDLER_ARIA_LABEL = 'ダイアログの位置';
const CLOSE_BUTTON_ICON_ALT = '閉じる';
const ModelessDialog = ({ header, children, footer, isOpen, onClickClose, onPressEscape, width, height, top, left, right, bottom, portalParent, className = '', decorators, ...props }) => {
    const labelId = (0, useId_1.useId)();
    const classNames = (0, useClassNames_1.useClassNames)().modelessDialog;
    const { createPortal } = (0, useDialogPortal_1.useDialogPortal)(portalParent);
    const theme = (0, useTheme_1.useTheme)();
    const wrapperRef = (0, react_1.useRef)(null);
    const focusTargetRef = (0, react_1.useRef)(null);
    const [wrapperPosition, setWrapperPosition] = (0, react_1.useState)(undefined);
    const [centering, setCentering] = (0, react_1.useState)({});
    const [position, setPosition] = (0, react_1.useState)({
        x: 0,
        y: 0,
    });
    const [draggableBounds, setDraggableBounds] = (0, react_1.useState)();
    const dialogHandlerAriaLabel = (0, react_1.useMemo)(() => decorators?.dialogHandlerAriaLabel?.(DIALOG_HANDLER_ARIA_LABEL) || DIALOG_HANDLER_ARIA_LABEL, [decorators]);
    const defaultAriaValuetext = (0, react_1.useMemo)(() => wrapperPosition
        ? `上から${Math.trunc(wrapperPosition.top)}px、左から${Math.trunc(wrapperPosition.left)}px`
        : '', [wrapperPosition]);
    const dialogHandlerAriaValuetext = (0, react_1.useMemo)(() => defaultAriaValuetext
        ? decorators?.dialogHandlerAriaValuetext?.(defaultAriaValuetext, wrapperPosition) ||
            defaultAriaValuetext
        : undefined, [defaultAriaValuetext, wrapperPosition, decorators]);
    const closeButtonIconAlt = (0, react_1.useMemo)(() => decorators?.closeButtonIconAlt?.(CLOSE_BUTTON_ICON_ALT) || CLOSE_BUTTON_ICON_ALT, [decorators]);
    const topStyle = centering.top !== undefined ? centering.top : top;
    const leftStyle = centering.left !== undefined ? centering.left : left;
    const handleArrowKey = (0, react_1.useCallback)((e) => {
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
    (0, react_1.useEffect)(() => {
        if (wrapperRef.current instanceof Element) {
            setWrapperPosition(wrapperRef.current.getBoundingClientRect());
        }
    }, [position]);
    (0, react_1.useEffect)(() => {
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
    (0, react_1.useEffect)(() => {
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
    (0, react_1.useEffect)(() => {
        if (isOpen) {
            setPosition({ x: 0, y: 0 });
            focusTargetRef.current?.focus();
        }
    }, [isOpen]);
    (0, useHandleEscape_1.useHandleEscape)((0, react_1.useCallback)(() => {
        if (isOpen) {
            onPressEscape && onPressEscape();
        }
    }, [isOpen, onPressEscape]));
    return createPortal(react_1.default.createElement(DialogOverlap_1.DialogOverlap, { isOpen: isOpen },
        react_1.default.createElement(react_draggable_1.default, { handle: `.${classNames.handle}`, onStart: (_, data) => setPosition({ x: data.x, y: data.y }), onDrag: (_, data) => {
                setPosition((prev) => {
                    return {
                        x: prev.x + data.deltaX,
                        y: prev.y + data.deltaY,
                    };
                });
            }, position: position, bounds: draggableBounds },
            react_1.default.createElement(Layout, { ...props, className: `${className} ${classNames.wrapper}`, style: {
                    top: topStyle,
                    left: leftStyle,
                    right,
                    bottom,
                    width,
                    height,
                }, ref: wrapperRef, role: "dialog", "aria-labelledby": labelId },
                react_1.default.createElement(Box, { isWidthAuto: width === undefined, left: left, right: right, themes: theme, className: classNames.box },
                    react_1.default.createElement("div", { tabIndex: -1, ref: focusTargetRef }),
                    react_1.default.createElement(Header, { className: classNames.header, themes: theme },
                        react_1.default.createElement(DialogHandler, { className: classNames.handle, themes: theme, tabIndex: 0, role: "slider", "aria-label": dialogHandlerAriaLabel, "aria-valuetext": dialogHandlerAriaValuetext, onKeyDown: handleArrowKey },
                            react_1.default.createElement(Icon_1.FaGripHorizontalIcon, null)),
                        react_1.default.createElement(Title, { id: labelId, themes: theme }, header),
                        react_1.default.createElement(CloseButtonLayout, null,
                            react_1.default.createElement(Button_1.Button, { type: "button", size: "s", square: true, onClick: onClickClose, className: classNames.closeButton },
                                react_1.default.createElement(Icon_1.FaTimesIcon, { alt: closeButtonIconAlt })))),
                    react_1.default.createElement(Content, { className: classNames.content }, children),
                    footer && (react_1.default.createElement(Footer, { className: classNames.footer, themes: theme }, footer)))))));
};
exports.ModelessDialog = ModelessDialog;
const Layout = styled_components_1.default.div `
  position: fixed;
`;
const Box = (0, styled_components_1.default)(Base_1.Base).attrs({ radius: 'm', layer: 3 }) `
  ${({ isWidthAuto, left = 0, right = 0, themes: { spacingByChar } }) => {
    const leftMargin = typeof left === 'number' ? `${left}px` : left;
    const rightMargin = typeof right === 'number' ? `${right}px` : right;
    return (0, styled_components_1.css) `
      display: flex;
      flex-direction: column;
      ${isWidthAuto &&
        (0, styled_components_1.css) `
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
const Header = styled_components_1.default.div `
  ${({ themes: { color, border, spacingByChar } }) => (0, styled_components_1.css) `
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
const Title = styled_components_1.default.div `
  ${({ themes: { spacingByChar } }) => (0, styled_components_1.css) `
    /* DialogHandlerの上に出すためにスタッキングコンテキストを生成 */
    position: relative;
    margin: ${spacingByChar(1)} ${spacingByChar(1)} ${spacingByChar(1)} 0;
  `}
`;
const DialogHandler = styled_components_1.default.div `
  ${({ themes: { color, shadow, radius } }) => (0, styled_components_1.css) `
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
const CloseButtonLayout = styled_components_1.default.div `
  /* DialogHandlerの上に出すためにスタッキングコンテキストを生成 */
  position: relative;
  flex-shrink: 0;
  margin-left: auto;
`;
const Content = styled_components_1.default.div `
  flex: 1;
  overflow: auto;
  overscroll-behavior: contain;
`;
const Footer = styled_components_1.default.div `
  ${({ themes: { border } }) => (0, styled_components_1.css) `
    border-top: ${border.shorthand};
  `}
`;
//# sourceMappingURL=ModelessDialog.js.map