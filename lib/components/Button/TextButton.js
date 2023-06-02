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
exports.TextButtonAnchor = exports.TextButton = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const BaseButton_1 = require("./BaseButton");
const useClassNames_1 = require("./useClassNames");
/**
 * @deprecated `TextButton` コンポーネントは非推奨です。代わりに `Button` コンポーネントと `variant` プロパティを使用してください。
 */
const TextButton = ({ type = 'button', className = '', ...props }) => {
    const theme = (0, useTheme_1.useTheme)();
    const { textButton } = (0, useClassNames_1.useClassNames)();
    return (react_1.default.createElement(TextStyleButton, { ...props, themes: theme, type: type, className: `${className} ${textButton.wrapper}` }));
};
exports.TextButton = TextButton;
/**
 * @deprecated `TextButtonAnchor` コンポーネントは非推奨です。代わりに `AnchorButton` コンポーネントと `variant` プロパティを使用してください。
 */
const TextButtonAnchor = ({ className = '', ...props }) => {
    const theme = (0, useTheme_1.useTheme)();
    const { textButtonAnchor } = (0, useClassNames_1.useClassNames)();
    return (
    // eslint-disable-next-line smarthr/a11y-anchor-has-href-attribute
    react_1.default.createElement(TextStyleButtonAnchor, { ...props, themes: theme, className: `${className} ${textButtonAnchor.wrapper}` }));
};
exports.TextButtonAnchor = TextButtonAnchor;
const textStyle = (0, styled_components_1.css) `
  ${({ themes }) => {
    const { color } = themes;
    return (0, styled_components_1.css) `
      background-color: transparent;
      color: ${color.TEXT_BLACK};

      &:focus-visible,
      &:hover {
        background-color: ${color.hoverColor(color.WHITE)};
        color: ${color.TEXT_BLACK};
      }
    `;
}}
`;
const disabledStyle = (0, styled_components_1.css) `
  ${({ themes: { color } }) => (0, styled_components_1.css) `
    background-color: transparent;
    color: ${color.disableColor(color.TEXT_DISABLED)};
  `}
`;
const TextStyleButton = (0, styled_components_1.default)(BaseButton_1.BaseButton) `
  ${textStyle}
  &[disabled] {
    ${disabledStyle}
  }
`;
const TextStyleButtonAnchor = (0, styled_components_1.default)(BaseButton_1.BaseButtonAnchor) `
  ${textStyle}
  &:not([href]) {
    ${disabledStyle}
  }
`;
//# sourceMappingURL=TextButton.js.map