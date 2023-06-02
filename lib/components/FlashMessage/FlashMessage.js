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
exports.FlashMessage = exports.roles = exports.animationTypes = exports.messageTypes = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const Button_1 = require("../Button");
const Icon_1 = require("../Icon");
const useClassNames_1 = require("./useClassNames");
exports.messageTypes = ['success', 'info', 'warning', 'error'];
exports.animationTypes = ['bounce', 'fade', 'none'];
exports.roles = ['alert', 'status'];
const REMOVE_DELAY = 8000;
/**
 * @deprecated `FlashMessage` は気づきにくいため、安易な使用はお勧めしません。`NotificationBar` や `Dialog` の使用を検討してください。
 */
const FlashMessage = ({ visible, type, text, animation = 'bounce', role = 'alert', className = '', onClose, autoClose = true, ...props }) => {
    const theme = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)();
    (0, react_1.useEffect)(() => {
        if (!visible || !autoClose) {
            return;
        }
        const timerId = setTimeout(onClose, REMOVE_DELAY);
        return () => {
            clearTimeout(timerId);
        };
    }, [autoClose, onClose, visible]);
    if (!visible)
        return null;
    let Icon;
    let iconColor;
    switch (type) {
        case 'success':
            Icon = Icon_1.FaCheckCircleIcon;
            iconColor = theme.color.MAIN;
            break;
        case 'info':
            Icon = Icon_1.FaInfoCircleIcon;
            iconColor = theme.color.TEXT_GREY;
            break;
        case 'warning':
            Icon = Icon_1.WarningIcon;
            iconColor = theme.color.WARNING;
            break;
        case 'error':
            Icon = Icon_1.FaExclamationCircleIcon;
            iconColor = theme.color.DANGER;
            break;
    }
    return (react_1.default.createElement(Wrapper, { ...props, className: `${type} ${classNames.wrapper}  ${className}`, themes: theme, animation: animation, role: role },
        react_1.default.createElement(IconWrapper, null,
            react_1.default.createElement(Icon, { color: iconColor, className: classNames.icon })),
        react_1.default.createElement(Txt, { themes: theme, className: classNames.text }, text),
        react_1.default.createElement(CloseButton, { themes: theme, className: `close ${classNames.button}`, onClick: onClose, size: "s", square: true },
            react_1.default.createElement(Icon_1.FaTimesIcon, { alt: "\u9589\u3058\u308B" }))));
};
exports.FlashMessage = FlashMessage;
const bounceAnimation = (0, styled_components_1.keyframes) `
  from,
  20%,
  53%,
  80%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translate3d(0, 0, 0);
  }
  40%,
  43% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -30px, 0);
  }
  70% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
`;
const fadeAnimation = (0, styled_components_1.keyframes) `
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;
const Wrapper = styled_components_1.default.div `
  ${({ themes, animation }) => {
    const { border, fontSize, spacingByChar, radius, color, zIndex, shadow } = themes;
    let keyframe = bounceAnimation;
    switch (animation) {
        case 'bounce':
            keyframe = bounceAnimation;
            break;
        case 'fade':
            keyframe = fadeAnimation;
            break;
        case 'none':
            keyframe = fadeAnimation;
            break;
    }
    return (0, styled_components_1.css) `
      z-index: ${zIndex.FLASH_MESSAGE};
      position: fixed;
      bottom: ${spacingByChar(0.5)};
      left: ${spacingByChar(0.5)};

      display: flex;
      align-items: center;
      gap: ${spacingByChar(0.5)};

      box-shadow: ${shadow.LAYER4};
      border: ${border.shorthand};
      border-radius: ${radius.m};
      background-color: ${color.WHITE};
      padding: ${spacingByChar(1)};

      /* Icon + margin + 8文字 + margin + Button(border + padding + fontSize) */
      min-width: calc(
        1em + ${spacingByChar(0.5)} + 8em + ${spacingByChar(0.5)} + (${border.lineWidth} * 2) +
          (${spacingByChar(0.5)} * 2) + ${fontSize.S}
      );
      animation: ${keyframe} ${animation === 'none' ? '0.01s' : '1s'} 0s both;

      @media (prefers-reduced-motion) {
        animation-duration: 0.01s;
      }
    `;
}}
`;
const IconWrapper = styled_components_1.default.span `
  flex-shrink: 0;

  svg {
    display: block;
  }
`;
const Txt = styled_components_1.default.p `
  ${({ themes: { fontSize, leading } }) => {
    return (0, styled_components_1.css) `
      flex-grow: 1;
      flex-shrink: 1;

      /* line-height 分 padding が広がってしまうのを調整 */
      margin-top: calc(((${fontSize.M} * ${leading.NORMAL}) - ${fontSize.M}) / -2);
      margin-bottom: calc(((${fontSize.M} * ${leading.NORMAL}) - ${fontSize.M}) / -2);
      padding: 0;
      font-size: ${fontSize.M};
      line-height: ${leading.NORMAL};
    `;
}}
`;
const CloseButton = (0, styled_components_1.default)(Button_1.Button)(({ themes: { spacingByChar } }) => (0, styled_components_1.css) `
    margin-top: ${spacingByChar(-0.5)};
    margin-right: ${spacingByChar(-0.5)};
    margin-bottom: ${spacingByChar(-0.5)};
  `);
//# sourceMappingURL=FlashMessage.js.map