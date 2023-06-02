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
exports.CheckBoxInput = void 0;
const polished_1 = require("polished");
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const Icon_1 = require("../Icon");
const useClassNames_1 = require("./useClassNames");
exports.CheckBoxInput = (0, react_1.forwardRef)(({ mixed = false, onChange, ...props }, ref) => {
    const theme = (0, useTheme_1.useTheme)();
    const { checked, disabled } = props;
    const boxClassName = `${checked ? 'active' : ''} ${disabled ? 'disabled' : ''}`;
    const handleChange = (0, react_1.useCallback)((e) => {
        if (onChange)
            onChange(e);
    }, [onChange]);
    const classNames = (0, useClassNames_1.useClassNames)();
    return (react_1.default.createElement(Wrapper, { themes: theme },
        react_1.default.createElement(Input, { ...props, ...(mixed && { 'aria-checked': 'mixed' }), type: "checkbox", onChange: handleChange, className: classNames.checkBox, themes: theme, ref: ref, "aria-invalid": props.error || undefined }),
        react_1.default.createElement(Box, { className: boxClassName, themes: theme, error: props.error }),
        react_1.default.createElement(IconWrap, { themes: theme }, mixed ? react_1.default.createElement(Icon_1.FaMinusIcon, { color: "TEXT_WHITE" }) : react_1.default.createElement(Icon_1.FaCheckIcon, { color: "TEXT_WHITE" }))));
});
const Wrapper = styled_components_1.default.span `
  ${({ themes }) => {
    const { fontSize } = themes;
    return (0, styled_components_1.css) `
      position: relative;
      display: inline-block;
      width: ${fontSize.M};
      height: ${fontSize.M};
      flex-shrink: 0;
      line-height: 1;
      box-sizing: border-box;
    `;
}}
`;
const Box = styled_components_1.default.span `
  ${({ themes, error }) => {
    const { border, color } = themes;
    return (0, styled_components_1.css) `
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 4px;
      border: ${border.shorthand};
      background-color: ${color.WHITE};
      box-sizing: border-box;
      pointer-events: none;

      @media (prefers-contrast: more) {
        & {
          border: ${border.highContrast};
        }
      }

      /* FIXME: なぜか static classname になってしまうため & を重ねている */
      input:checked + && {
        border-color: ${color.MAIN};
        background-color: ${color.MAIN};
        @media (prefers-contrast: more) {
          & {
            border: ${border.highContrast};
          }
        }
      }

      /* FIXME: なぜか static classname になってしまうため & を重ねている */
      input[disabled] + && {
        background-color: ${color.BORDER};
        border-color: ${color.BORDER};
      }

      ${error &&
        (0, styled_components_1.css) `
        border-color: ${color.DANGER};
      `}
    `;
}}
`;
const Input = styled_components_1.default.input `
  ${({ themes }) => {
    const { shadow, color } = themes;
    return (0, styled_components_1.css) `
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      cursor: pointer;
      &[disabled] {
        pointer-events: none;
      }
      &:hover:not([disabled]) + span {
        box-shadow: 0 0 0 2px ${(0, polished_1.transparentize)(0.78, color.MAIN)};
      }
      &:focus-visible + span {
        ${shadow.focusIndicatorStyles};
      }
    `;
}}
`;
const IconWrap = styled_components_1.default.span `
  ${({ themes }) => {
    const { fontSize } = themes;
    return (0, styled_components_1.css) `
      position: absolute;
      top: 50%;
      left: 50%;
      display: inline-block;
      width: ${fontSize.XXS};
      height: ${fontSize.XXS};
      font-size: ${fontSize.XXS};
      transform: translate(-50%, -50%);
      pointer-events: none;

      input:not(:checked) ~ & > svg {
        fill: transparent;
      }

      & > svg {
        vertical-align: top;
      }
    `;
}}
`;
//# sourceMappingURL=CheckBoxInput.js.map