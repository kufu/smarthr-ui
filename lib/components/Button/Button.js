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
exports.Button = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const Icon_1 = require("../Icon");
const Layout_1 = require("../Layout");
const Loader_1 = require("../Loader");
const Tooltip_1 = require("../Tooltip");
const ButtonInner_1 = require("./ButtonInner");
const ButtonWrapper_1 = require("./ButtonWrapper");
const useClassNames_1 = require("./useClassNames");
exports.Button = (0, react_1.forwardRef)(({ type = 'button', size = 'default', square = false, prefix, suffix, wide = false, variant = 'secondary', disabled, disabledDetail, className = '', children, loading = false, ...props }, ref) => {
    const theme = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)().button;
    const loader = react_1.default.createElement(Loader, { size: "s", type: "light", variant: variant, themes: theme });
    const actualPrefix = !loading && prefix;
    const actualSuffix = loading && !square ? loader : suffix;
    const disabledOnLoading = loading || disabled;
    const actualChildren = loading && square ? loader : children;
    const button = (react_1.default.createElement(ButtonWrapper_1.ButtonWrapper, { ...props, type: type, size: size, square: square, wide: wide, variant: variant, className: `${className} ${classNames.wrapper}`, buttonRef: ref, disabled: disabledOnLoading, "$loading": loading },
        react_1.default.createElement(ButtonInner_1.ButtonInner, { prefix: actualPrefix, suffix: actualSuffix }, actualChildren)));
    if (disabled && disabledDetail) {
        const DisabledDetailIcon = disabledDetail.icon || Icon_1.FaInfoCircleIcon;
        return (react_1.default.createElement(DisabledDetailWrapper, { themes: theme, className: classNames.disabledWrapper },
            button,
            react_1.default.createElement(Tooltip_1.Tooltip, { message: disabledDetail.message, triggerType: "icon", horizontal: "auto", vertical: "auto" },
                react_1.default.createElement(DisabledDetailIcon, null))));
    }
    return button;
});
// BottomFixedArea での判定に用いるために displayName を明示的に設定する
exports.Button.displayName = 'Button';
const Loader = (0, styled_components_1.default)(Loader_1.Loader) `
  ${({ variant, themes: { color } }) => (0, styled_components_1.css) `
    vertical-align: bottom;

    &&& {
      .s {
        width: 1em;
        height: 1em;
      }
    }

    .light {
      border-color: ${variant === 'secondary'
    ? color.TEXT_DISABLED
    : color.disableColor(color.TEXT_WHITE)};
    }
  `}
`;
const DisabledDetailWrapper = (0, styled_components_1.default)(Layout_1.Cluster).attrs({
    inline: true,
    align: 'center',
    gap: 0.25,
}) `
  ${({ themes: { color, space } }) => (0, styled_components_1.css) `
    > .smarthr-ui-Tooltip {
      overflow-y: unset;

      .smarthr-ui-Icon {
        /* Tooltip との距離を変えずに反応範囲を広げるために negative space を使う */
        margin: ${space(-0.25)};
        padding: ${space(0.25)};

        /* global styleなどでborder-boxが適用されている場合表示崩れを起こす為、content-boxを指定する */
        box-sizing: content-box;
        color: ${color.TEXT_GREY};
      }
    }
  `}
`;
//# sourceMappingURL=Button.js.map