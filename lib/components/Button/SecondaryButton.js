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
exports.SecondaryButtonAnchor = exports.SecondaryButton = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const BaseButton_1 = require("./BaseButton");
const useClassNames_1 = require("./useClassNames");
/**
 * @deprecated `SecondaryButton` コンポーネントは非推奨です。代わりに `Button` コンポーネントと `variant` プロパティを使用してください。
 */
const SecondaryButton = ({ type = 'button', className = '', ...props }) => {
    const theme = (0, useTheme_1.useTheme)();
    const { secondaryButton } = (0, useClassNames_1.useClassNames)();
    return (react_1.default.createElement(SecondaryStyleButton, { ...props, themes: theme, type: type, className: `${className} ${secondaryButton.wrapper}` }));
};
exports.SecondaryButton = SecondaryButton;
// set the displayName explicit.
// This is for error message of BottomFixedArea component.
exports.SecondaryButton.displayName = 'SecondaryButton';
/**
 * @deprecated `SecondaryButtonAnchor` コンポーネントは非推奨です。代わりに `AnchorButton` コンポーネントと `variant` プロパティを使用してください。
 */
const SecondaryButtonAnchor = ({ className = '', ...props }) => {
    const theme = (0, useTheme_1.useTheme)();
    const { secondaryButtonAnchor } = (0, useClassNames_1.useClassNames)();
    return (
    // eslint-disable-next-line smarthr/a11y-anchor-has-href-attribute
    react_1.default.createElement(SecondaryStyleButtonAnchor, { ...props, themes: theme, className: `${className} ${secondaryButtonAnchor.wrapper}` }));
};
exports.SecondaryButtonAnchor = SecondaryButtonAnchor;
// set the displayName explicit.
// This is for error message of BottomFixedArea component.
exports.SecondaryButtonAnchor.displayName = 'SecondaryButtonAnchor';
const secondaryStyle = (0, styled_components_1.css) `
  ${({ themes }) => {
    const { color } = themes;
    return (0, styled_components_1.css) `
      border-color: ${color.BORDER};
      background-color: ${color.WHITE};
      color: ${color.TEXT_BLACK};

      &:focus-visible,
      &:hover {
        border-color: ${color.hoverColor(color.BORDER)};
        background-color: ${color.hoverColor(color.WHITE)};
        color: ${color.TEXT_BLACK};
      }
    `;
}}
`;
const disabledStyle = (0, styled_components_1.css) `
  ${({ themes: { color } }) => (0, styled_components_1.css) `
    border-color: ${color.disableColor(color.BORDER)};
    background-color: ${color.disableColor(color.WHITE)};
    color: ${color.TEXT_DISABLED};
  `}
`;
const SecondaryStyleButton = (0, styled_components_1.default)(BaseButton_1.BaseButton) `
  ${secondaryStyle}
  &[disabled] {
    ${disabledStyle}
  }
`;
const SecondaryStyleButtonAnchor = (0, styled_components_1.default)(BaseButton_1.BaseButtonAnchor) `
  ${secondaryStyle}
  &:not([href]) {
    ${disabledStyle}
  }
`;
//# sourceMappingURL=SecondaryButton.js.map