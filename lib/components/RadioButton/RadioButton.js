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
exports.RadioButton = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useId_1 = require("../../hooks/useId");
const useTheme_1 = require("../../hooks/useTheme");
const RadioButtonInput_1 = require("./RadioButtonInput");
const useClassNames_1 = require("./useClassNames");
exports.RadioButton = (0, react_1.forwardRef)(({ lineHeight = 1.5, children, className = '', ...props }, ref) => {
    const theme = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)();
    const radioButtonId = (0, useId_1.useId)(props.id);
    if (!children) {
        return (react_1.default.createElement(Wrapper, { className: `${className} ${classNames.wrapper}`, themes: theme },
            react_1.default.createElement(RadioButtonInput_1.RadioButtonInput, { ...props, ref: ref, className: classNames.radioButton })));
    }
    return (react_1.default.createElement(Wrapper, { className: `${className} ${classNames.wrapper}`, themes: theme },
        react_1.default.createElement(ButtonLayout, { "$height": `${lineHeight}em` },
            react_1.default.createElement(RadioButtonInput_1.RadioButtonInput, { ...props, ref: ref, id: radioButtonId })),
        react_1.default.createElement(Label, { htmlFor: radioButtonId, className: `${props.disabled ? 'disabled' : ''} ${classNames.label}`, "$lineHeight": lineHeight, themes: theme }, children)));
});
const Wrapper = styled_components_1.default.div `
  ${({ themes: { fontSize } }) => (0, styled_components_1.css) `
    display: inline-flex;
    align-items: start;
    font-size: ${fontSize.M};
  `}
`;
const ButtonLayout = styled_components_1.default.div `
  ${({ $height }) => (0, styled_components_1.css) `
    display: flex;
    align-items: center;
    height: ${$height};
  `}
`;
const Label = styled_components_1.default.label `
  ${({ themes, $lineHeight }) => {
    const { spacingByChar, color } = themes;
    return (0, styled_components_1.css) `
      margin-left: ${spacingByChar(0.5)};
      color: ${color.TEXT_BLACK};
      line-height: ${$lineHeight};
      cursor: pointer;

      &.disabled {
        color: ${color.TEXT_DISABLED};
        cursor: not-allowed;
      }
    `;
}}
`;
//# sourceMappingURL=RadioButton.js.map