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
exports.DialogContentInner = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useHandleEscape_1 = require("../../hooks/useHandleEscape");
const useTheme_1 = require("../../hooks/useTheme");
const BodyScrollSuppressor_1 = require("./BodyScrollSuppressor");
const DialogOverlap_1 = require("./DialogOverlap");
const DialogPositionProvider_1 = require("./DialogPositionProvider");
const FocusTrap_1 = require("./FocusTrap");
const useClassNames_1 = require("./useClassNames");
function exist(value) {
    return value !== undefined && value !== null;
}
const DialogContentInner = ({ onClickOverlay, onPressEscape = () => {
    /* noop */
}, isOpen, id, width, firstFocusTarget, ariaLabel, ariaLabelledby, children, className = '', ...props }) => {
    const classNames = (0, useClassNames_1.useClassNames)().dialog;
    const theme = (0, useTheme_1.useTheme)();
    const innerRef = (0, react_1.useRef)(null);
    (0, useHandleEscape_1.useHandleEscape)((0, react_1.useCallback)(() => {
        if (!isOpen) {
            return;
        }
        onPressEscape();
    }, [isOpen, onPressEscape]));
    const handleClickOverlay = (0, react_1.useCallback)(() => {
        if (!isOpen) {
            return;
        }
        onClickOverlay && onClickOverlay();
    }, [isOpen, onClickOverlay]);
    return (react_1.default.createElement(DialogPositionProvider_1.DialogPositionProvider, { top: props.top, bottom: props.bottom },
        react_1.default.createElement(DialogOverlap_1.DialogOverlap, { isOpen: isOpen },
            react_1.default.createElement(Layout, { className: classNames.wrapper, id: id },
                react_1.default.createElement(Background, { onClick: handleClickOverlay, themes: theme, className: classNames.background }),
                react_1.default.createElement(Inner, { ...props, "$width": width, ref: innerRef, themes: theme, role: "dialog", "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby, "aria-modal": "true", className: `${className} ${classNames.dialog}` },
                    react_1.default.createElement(FocusTrap_1.FocusTrap, { firstFocusTarget: firstFocusTarget }, children)),
                react_1.default.createElement(BodyScrollSuppressor_1.BodyScrollSuppressor, null)))));
};
exports.DialogContentInner = DialogContentInner;
const Layout = styled_components_1.default.div `
  position: fixed;
  inset: 0;
`;
const Inner = styled_components_1.default.div `
  ${({ themes, $width, top, right, bottom, left }) => {
    const { border, color, radius, shadow, space } = themes;
    const positionRight = exist(right) ? `${right}px` : 'auto';
    const positionBottom = exist(bottom) ? `${bottom}px` : 'auto';
    const positionTop = exist(top) ? `${top}px` : 'auto';
    const positionLeft = exist(left) ? `${left}px` : 'auto';
    const translateX = exist(right) || exist(left) ? '0' : 'calc((100vw - 100%) / 2)';
    const translateY = exist(top) || exist(bottom) ? '0' : 'calc((100vh - 100%) / 2)';
    return (0, styled_components_1.css) `
      position: absolute;
      inset: ${positionTop} ${positionRight} ${positionBottom} ${positionLeft};
      ${exist($width) &&
        (0, styled_components_1.css) `
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
const Background = styled_components_1.default.div `
  ${({ themes }) => {
    return (0, styled_components_1.css) `
      position: fixed;
      inset: 0;
      background-color: ${themes.color.SCRIM};
    `;
}}
`;
//# sourceMappingURL=DialogContentInner.js.map