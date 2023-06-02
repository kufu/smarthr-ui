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
exports.MessageDialogContentInner = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../../hooks/useTheme");
const Button_1 = require("../../Button");
const Layout_1 = require("../../Layout");
const Text_1 = require("../../Text");
const dialogHelper_1 = require("../dialogHelper");
const useClassNames_1 = require("../useClassNames");
const CLOSE_BUTTON_LABEL = '閉じる';
const MessageDialogContentInner = ({ title, subtitle, titleTag = 'h2', titleId, description, onClickClose, decorators, }) => {
    const classNames = (0, useClassNames_1.useClassNames)().dialog;
    const theme = (0, useTheme_1.useTheme)();
    const { offsetHeight, titleRef, bottomRef } = (0, dialogHelper_1.useOffsetHeight)();
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(TitleArea, { gap: 0.25, themes: theme, ref: titleRef, className: classNames.titleArea, as: titleTag },
            subtitle && (react_1.default.createElement(Text_1.Text, { size: "S", leading: "TIGHT", color: "TEXT_GREY", className: classNames.subtitle }, subtitle)),
            react_1.default.createElement(Text_1.Text, { id: titleId, size: "L", leading: "TIGHT", className: classNames.title }, title)),
        react_1.default.createElement(Description, { themes: theme, offsetHeight: offsetHeight, className: classNames.description }, description),
        react_1.default.createElement(Bottom, { themes: theme, ref: bottomRef, className: classNames.buttonArea },
            react_1.default.createElement(Button_1.Button, { onClick: onClickClose, className: classNames.closeButton }, decorators?.closeButtonLabel?.(CLOSE_BUTTON_LABEL) || CLOSE_BUTTON_LABEL))));
};
exports.MessageDialogContentInner = MessageDialogContentInner;
const TitleArea = (0, styled_components_1.default)(Layout_1.Stack)(({ themes: { border, spacing } }) => (0, styled_components_1.css) `
    margin-block: unset;
    border-bottom: ${border.shorthand};
    padding: ${spacing.XS} ${spacing.S};
  `);
const Description = styled_components_1.default.div `
  ${({ themes: { fontSize, spacingByChar }, offsetHeight }) => {
    return (0, styled_components_1.css) `
      max-height: calc(100vh - ${offsetHeight}px);
      overflow: auto;
      padding: 0 ${spacingByChar(1.5)};
      font-size: ${fontSize.M};
      line-height: 1.5;
    `;
}}
`;
const Bottom = styled_components_1.default.div `
  ${({ themes }) => {
    const { spacingByChar, border } = themes;
    return (0, styled_components_1.css) `
      display: flex;
      justify-content: flex-end;
      padding: ${spacingByChar(1)} ${spacingByChar(1.5)};
      border-top: ${border.shorthand};
    `;
}}
`;
//# sourceMappingURL=MessageDialogContentInner.js.map