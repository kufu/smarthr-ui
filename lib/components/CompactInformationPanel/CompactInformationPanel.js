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
exports.CompactInformationPanel = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const Base_1 = require("../Base");
const Icon_1 = require("../Icon");
const useClassNames_1 = require("./useClassNames");
const CompactInformationPanel = ({ type = 'info', className = '', children, ...props }) => {
    const theme = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)();
    return (react_1.default.createElement(Wrapper, { ...props, className: `${className} ${classNames.wrapper}`, themes: theme },
        callIcon(type, theme),
        react_1.default.createElement(Content, { className: classNames.content }, children)));
};
exports.CompactInformationPanel = CompactInformationPanel;
const callIcon = (type, theme) => {
    const { color } = theme;
    switch (type) {
        case 'info':
        default:
            return react_1.default.createElement(InfoIcon, { color: color.TEXT_GREY, "$theme": theme });
        case 'success':
            return react_1.default.createElement(SuccessIcon, { color: color.MAIN, "$theme": theme });
        case 'warning':
            return react_1.default.createElement(WarningIcon, { color: color.WARNING, "$theme": theme });
        case 'error':
            return react_1.default.createElement(ErrorIcon, { color: color.DANGER, "$theme": theme });
    }
};
const createIcon = (Icon) => (0, styled_components_1.default)(Icon)(({ $theme: { spacingByChar } }) => (0, styled_components_1.css) `
      flex-shrink: 0;

      /*
      it set line-height to 1.5 and align-items(flexbox) to start(default),
      translate-y 0.25em transform for leading
      */
      transform: translateY(0.25em);
      margin-right: ${spacingByChar(0.5)};
    `);
const InfoIcon = createIcon(Icon_1.FaInfoCircleIcon);
const SuccessIcon = createIcon(Icon_1.FaCheckCircleIcon);
const WarningIcon = createIcon(Icon_1.WarningIcon);
const ErrorIcon = createIcon(Icon_1.FaExclamationCircleIcon);
const Wrapper = (0, styled_components_1.default)(Base_1.Base) `
  ${({ themes: { spacingByChar, shadow } }) => {
    return (0, styled_components_1.css) `
      display: flex;
      box-shadow: ${shadow.LAYER3};
      padding: ${spacingByChar(1)};
    `;
}}
`;
const Content = styled_components_1.default.div `
  line-height: 1.5;
`;
//# sourceMappingURL=CompactInformationPanel.js.map