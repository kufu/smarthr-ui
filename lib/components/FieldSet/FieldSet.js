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
exports.FieldSet = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useId_1 = require("../../hooks/useId");
const useTheme_1 = require("../../hooks/useTheme");
const Heading_1 = require("../Heading");
const Icon_1 = require("../Icon");
const Input_1 = require("../Input");
const StatusLabel_1 = require("../StatusLabel");
const useClassNames_1 = require("./useClassNames");
/**
 * @deprecated `Fieldset` コンポーネントは非推奨です。代わりに `FormControl` を使ってください。
 */
const FieldSet = ({ label, labelType = 'subBlockTitle', labelTagType = 'span', errorMessage, helpMessage, className = '', labelSuffix, children, ...props }) => {
    const theme = (0, useTheme_1.useTheme)();
    const helpId = (0, useId_1.useId)();
    const classNames = (0, useClassNames_1.useClassNames)();
    return (react_1.default.createElement(Wrapper, { "$width": props.width || 'auto', className: `${className} ${classNames.wrapper}`, "aria-describedby": helpMessage ? helpId : undefined },
        react_1.default.createElement(Title, { themes: theme, className: classNames.title },
            react_1.default.createElement(TitleText, { type: labelType, tag: labelTagType, className: classNames.titleText }, label),
            props.required && (react_1.default.createElement(StatusLabel_1.StatusLabel, { type: "red", className: classNames.label }, "\u5FC5\u9808")),
            labelSuffix && labelSuffix),
        children ? (children) : (
        // eslint-disable-next-line smarthr/a11y-input-has-name-attribute
        react_1.default.createElement(Input_1.Input, { ...props, error: !!errorMessage, className: classNames.input })),
        errorMessage &&
            (Array.isArray(errorMessage) ? errorMessage : [errorMessage]).map((message, index) => (react_1.default.createElement(Error, { themes: theme, key: index, className: classNames.error },
                react_1.default.createElement(ErrorIcon, { color: theme.color.DANGER, className: classNames.errorIcon }),
                react_1.default.createElement(ErrorText, { className: classNames.errorText }, message)))),
        helpMessage && (react_1.default.createElement(Help, { id: helpId, themes: theme, className: classNames.help }, helpMessage))));
};
exports.FieldSet = FieldSet;
const Wrapper = styled_components_1.default.div `
  ${({ $width }) => (0, styled_components_1.css) `
    display: inline-block;
    width: ${typeof $width === 'number' ? `${$width}px` : $width};
  `}
`;
const Title = styled_components_1.default.div `
  ${({ themes: { spacingByChar } }) => (0, styled_components_1.css) `
    display: flex;
    align-items: center;
    margin: 0 0 ${spacingByChar(0.5)};

    > *:not(:first-child) {
      margin-left: ${spacingByChar(0.5)};
    }
  `}
`;
const TitleText = (0, styled_components_1.default)(Heading_1.Heading) `
  display: inline-block;
`;
const Help = styled_components_1.default.div `
  ${({ themes: { color, fontSize, spacingByChar } }) => (0, styled_components_1.css) `
    margin: ${spacingByChar(0.5)} 0 0 0;
    font-size: ${fontSize.S};
    line-height: 1;
    color: ${color.TEXT_GREY};
  `}
`;
const Error = styled_components_1.default.div `
  ${({ themes: { fontSize, spacingByChar } }) => (0, styled_components_1.css) `
    margin: ${spacingByChar(0.5)} 0 0 0;
    font-size: ${fontSize.S};
    line-height: 1;
  `}
`;
const ErrorIcon = (0, styled_components_1.default)(Icon_1.FaExclamationCircleIcon) `
  margin-right: 0.4rem;
  vertical-align: middle;
`;
const ErrorText = styled_components_1.default.span `
  vertical-align: middle;
`;
//# sourceMappingURL=FieldSet.js.map