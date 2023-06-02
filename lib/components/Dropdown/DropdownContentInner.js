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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropdownContentInner = exports.DropdownContentInnerContext = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const DropdownCloser_1 = require("./DropdownCloser");
const dropdownHelper_1 = require("./dropdownHelper");
const useKeyboardNavigation_1 = require("./useKeyboardNavigation");
exports.DropdownContentInnerContext = (0, react_1.createContext)({
    maxHeight: '',
});
const DropdownContentInner = ({ triggerRect, scrollable, children, className, controllable, ...props }) => {
    const theme = (0, useTheme_1.useTheme)();
    const [isActive, setIsActive] = (0, react_1.useState)(false);
    const [contentBox, setContentBox] = (0, react_1.useState)({
        top: 'auto',
        maxHeight: '',
    });
    const wrapperRef = (0, react_1.useRef)(null);
    const focusTargetRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (wrapperRef.current) {
            setContentBox((0, dropdownHelper_1.getContentBoxStyle)(triggerRect, {
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
    (0, react_1.useEffect)(() => {
        if (isActive) {
            focusTargetRef.current?.focus();
        }
    }, [isActive]);
    (0, useKeyboardNavigation_1.useKeyboardNavigation)(wrapperRef, focusTargetRef);
    return (react_1.default.createElement(Wrapper, { ...props, ref: wrapperRef, contentBox: contentBox, className: `${className} ${isActive ? 'active' : ''}`, themes: theme },
        react_1.default.createElement("div", { tabIndex: -1, ref: focusTargetRef }),
        controllable ? (react_1.default.createElement(ControllableWrapper, { scrollable: scrollable, contentBox: contentBox }, children)) : (react_1.default.createElement(exports.DropdownContentInnerContext.Provider, { value: { maxHeight: contentBox.maxHeight } },
            react_1.default.createElement(DropdownCloser_1.DropdownCloser, null, children)))));
};
exports.DropdownContentInner = DropdownContentInner;
const Wrapper = styled_components_1.default.div `
  ${({ contentBox, themes }) => {
    const { color, radius, zIndex, shadow, spacingByChar } = themes;
    const leftMargin = contentBox.left === undefined ? spacingByChar(0.5) : `max(${contentBox.left}, 0px)`;
    const rightMargin = contentBox.right === undefined ? spacingByChar(0.5) : `max(${contentBox.right}, 0px)`;
    return (0, styled_components_1.css) `
      display: flex;
      visibility: hidden;
      z-index: ${zIndex.OVERLAP_BASE};
      position: absolute;
      top: ${contentBox.top};
      ${contentBox.left !== undefined &&
        (0, styled_components_1.css) `
        left: ${contentBox.left};
      `}
      ${contentBox.right !== undefined &&
        (0, styled_components_1.css) `
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
const ControllableWrapper = styled_components_1.default.div `
  ${({ contentBox, scrollable }) => {
    return (0, styled_components_1.css) `
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