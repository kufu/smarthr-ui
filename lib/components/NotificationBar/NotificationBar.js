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
exports.NotificationBar = exports.messageTypes = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const Button_1 = require("../Button");
const Icon_1 = require("../Icon");
const Layout_1 = require("../Layout");
const Text_1 = require("../Text");
const useClassNames_1 = require("./useClassNames");
exports.messageTypes = ['info', 'success', 'error', 'warning'];
const NotificationBar = ({ type, bold = false, message, onClose, children, role = type === 'info' ? 'status' : 'alert', className = '', ...props }) => {
    const theme = (0, useTheme_1.useTheme)();
    const { color } = theme;
    const classNames = (0, useClassNames_1.useClassNames)();
    const { Icon, iconColor, ...colorSet } = (0, react_1.useMemo)(() => {
        switch (type) {
            case 'info':
                return {
                    Icon: Icon_1.FaInfoCircleIcon,
                    iconColor: color.TEXT_GREY,
                };
            case 'success': {
                const colors = bold
                    ? {
                        iconColor: color.TEXT_WHITE,
                        fgColor: color.TEXT_WHITE,
                        bgColor: color.MAIN,
                    }
                    : {};
                return {
                    Icon: Icon_1.FaCheckCircleIcon,
                    iconColor: color.MAIN,
                    ...colors,
                };
            }
            case 'warning': {
                const colors = bold
                    ? {
                        Icon: Icon_1.FaExclamationTriangleIcon,
                        fgColor: color.TEXT_BLACK,
                        bgColor: color.WARNING_YELLOW,
                    }
                    : {};
                return {
                    Icon: Icon_1.WarningIcon,
                    iconColor: color.TEXT_BLACK,
                    ...colors,
                };
            }
            case 'error': {
                const colors = bold
                    ? {
                        iconColor: color.TEXT_WHITE,
                        fgColor: color.TEXT_WHITE,
                        bgColor: color.DANGER,
                    }
                    : {};
                return {
                    Icon: Icon_1.FaExclamationCircleIcon,
                    iconColor: color.DANGER,
                    ...colors,
                };
            }
        }
    }, [color, type, bold]);
    return (react_1.default.createElement(Wrapper, { ...props, className: `${type} ${classNames.wrapper}${className && ` ${className}`}`, role: role, themes: theme, colorSet: colorSet },
        react_1.default.createElement(MessageArea, { themes: theme, className: classNames.messageArea },
            react_1.default.createElement(IconLayout, null,
                react_1.default.createElement(Icon, { color: iconColor })),
            react_1.default.createElement(StyledText, { leading: "TIGHT" }, message)),
        react_1.default.createElement(ActionArea, { themes: theme, className: classNames.actionArea },
            children && (react_1.default.createElement(ActionWrapper, { themes: theme, className: classNames.actions, align: "center", justify: "flex-end" }, children)),
            onClose && (react_1.default.createElement(CloseButton, { variant: "text", colorSet: colorSet, themes: theme, onClick: onClose, className: classNames.closeButton, size: "s" },
                react_1.default.createElement(Icon_1.FaTimesIcon, { alt: "\u9589\u3058\u308B" }))))));
};
exports.NotificationBar = NotificationBar;
const Wrapper = styled_components_1.default.div(({ themes: { color, fontSize, leading, space }, colorSet: { fgColor = color.TEXT_BLACK, bgColor = color.WHITE }, animate, }) => (0, styled_components_1.css) `
    display: flex;
    gap: ${space(1)};
    align-items: center;
    background-color: ${bgColor};
    padding: ${space(0.75)};
    color: ${fgColor};
    ${animate &&
    (0, styled_components_1.css) `
      /* 1行の場合の高さ分だけスライドさせる */
      /* stylelint-disable-next-line */
      animation: ${slideIn(`calc(${fontSize.M} * ${leading.TIGHT} + ${space(1.5)})`)} 0.2s ease-out;
    `}
  `);
const slideIn = (translateLength) => (0, styled_components_1.keyframes) `
  from {
    opacity: 0;
    transform: translateY(calc(-1 * ${translateLength}));
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;
const MessageArea = styled_components_1.default.div(({ themes: { spacingByChar } }) => (0, styled_components_1.css) `
    display: flex;
    gap: ${spacingByChar(0.5)};
    align-items: center;
    flex-grow: 1;

    /* flexbox で ellipsis するために min-width をつけて幅の計算を発生させている */
    min-width: 0;
  `);
const IconLayout = styled_components_1.default.div `
  /* 子のアイコンの line-height を打ち消すために指定 */
  display: flex;
`;
const StyledText = (0, styled_components_1.default)(Text_1.Text) `
  /* flexbox で ellipsis するために min-width をつけて幅の計算を発生させている */
  min-width: 0;
`;
const ActionArea = styled_components_1.default.div(({ themes: { spacingByChar } }) => (0, styled_components_1.css) `
    display: flex;
    gap: ${spacingByChar(0.5)};
    align-items: center;
    flex-shrink: 0;
  `);
const ActionWrapper = (0, styled_components_1.default)(Layout_1.Cluster)(({ themes: { spacingByChar } }) => (0, styled_components_1.css) `
    margin-top: ${spacingByChar(-0.5)};
    margin-bottom: ${spacingByChar(-0.5)};
  `);
const CloseButton = (0, styled_components_1.default)(Button_1.Button)(({ themes: { color, spacingByChar }, colorSet: { fgColor = color.TEXT_BLACK, bgColor = color.WHITE }, }) => (0, styled_components_1.css) `
    flex-shrink: 0;

    margin-top: ${spacingByChar(-0.5)};
    margin-right: ${spacingByChar(-0.5)};
    margin-bottom: ${spacingByChar(-0.5)};
    color: ${fgColor};

    &:hover,
    &:focus-visible {
      background-color: ${color.hoverColor(bgColor)};
      color: ${fgColor};
    }
  `);
//# sourceMappingURL=NotificationBar.js.map