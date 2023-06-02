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
exports.Select = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const ua_1 = require("../../libs/ua");
const Icon_1 = require("../Icon");
const useClassNames_1 = require("./useClassNames");
const BLANK_LABEL = '選択してください';
exports.Select = (0, react_1.forwardRef)(({ options, onChange, onChangeValue, error = false, width = 'auto', hasBlank = false, decorators, size = 'default', className = '', disabled, ...props }, ref) => {
    const theme = (0, useTheme_1.useTheme)();
    const widthStyle = typeof width === 'number' ? `${width}px` : width;
    const handleChange = (0, react_1.useCallback)((e) => {
        if (onChange)
            onChange(e);
        if (onChangeValue) {
            const flattenOptions = options.reduce((pre, cur) => pre.concat('value' in cur ? cur : cur.options), []);
            const selectedOption = flattenOptions.find((option) => option.value === e.target.value);
            if (selectedOption) {
                onChangeValue(selectedOption.value);
            }
        }
    }, [onChange, onChangeValue, options]);
    const classNames = (0, useClassNames_1.useClassNames)();
    return (react_1.default.createElement(Wrapper, { className: `${className} ${classNames.wrapper} ${generateSizeClassName(size)}`, "$width": widthStyle },
        react_1.default.createElement(StyledSelect, { ...props, onChange: handleChange, "aria-invalid": error || undefined, themes: theme, error: error, disabled: disabled, ref: ref },
            hasBlank && (react_1.default.createElement("option", { value: "" }, decorators?.blankLabel?.(BLANK_LABEL) || BLANK_LABEL)),
            options.map((option) => {
                if ('value' in option) {
                    return (react_1.default.createElement("option", { ...option, key: option.value }, option.label));
                }
                const { options: groupedOptions, ...optgroup } = option;
                return (react_1.default.createElement("optgroup", { ...optgroup, key: optgroup.label }, groupedOptions.map((groupedOption) => (react_1.default.createElement("option", { ...groupedOption, key: groupedOption.value }, groupedOption.label)))));
            }),
            // Support for not omitting labels in Mobile Safari
            ua_1.isMobileSafari && react_1.default.createElement(BlankOptgroup, null)),
        react_1.default.createElement(IconWrap, { themes: theme },
            react_1.default.createElement(Icon_1.FaSortIcon, null))));
});
const generateSizeClassName = (size) => (size === 's' ? '--small' : '');
const Wrapper = styled_components_1.default.div `
  ${({ $width }) => (0, styled_components_1.css) `
    position: relative;
    box-sizing: border-box;
    width: ${$width};
  `}
`;
const StyledSelect = styled_components_1.default.select `
  ${({ error, themes: { border, color, fontSize, leading, radius, shadow, spacingByChar } }) => (0, styled_components_1.css) `
    appearance: none;
    cursor: pointer;
    outline: none;
    border-radius: ${radius.m};
    border: ${border.shorthand};
    background-color: ${color.WHITE};
    padding-inline: ${spacingByChar(0.5)} ${spacingByChar(2)};
    font-size: ${fontSize.M};
    line-height: ${leading.NONE};
    color: ${color.TEXT_BLACK};
    width: 100%;
    @media (prefers-contrast: more) {
      & {
        border: ${border.highContrast};
      }
    }

    /* padding に依る積み上げでは文字が見切れてしまうため */
    min-height: calc(${fontSize.M} + ${spacingByChar(0.75)} * 2 + ${border.lineWidth} * 2);

    ${error &&
    (0, styled_components_1.css) `
      border-color: ${color.DANGER};
    `}

    &:hover {
      background-color: ${color.hoverColor(color.WHITE)};
    }

    &:focus-visible {
      ${shadow.focusIndicatorStyles}
    }

    &:disabled {
      pointer-events: none;
      opacity: 1;
      border-color: ${color.disableColor(color.BORDER)};
      background-color: ${color.hoverColor(color.WHITE)};
      color: ${color.TEXT_DISABLED};
    }

    .--small & {
      padding-inline: ${spacingByChar(0.5)};
      font-size: ${fontSize.S};

      /* padding に依る積み上げでは文字が見切れてしまうため */
      min-height: calc(${fontSize.S} + ${spacingByChar(0.5)} * 2 + ${border.lineWidth} * 2);
    }
  `}
`;
const IconWrap = styled_components_1.default.span `
  ${({ themes: { color, fontSize, spacingByChar } }) => (0, styled_components_1.css) `
    pointer-events: none;
    position: absolute;
    top: 0;
    right: ${spacingByChar(0.75)};
    bottom: 0;
    display: inline-flex;
    align-items: center;
    color: ${color.TEXT_GREY};

    ${StyledSelect}:disabled + & {
      color: ${color.TEXT_DISABLED};
    }
    ${StyledSelect}:focus-visible + & {
      color: ${color.TEXT_BLACK};
    }

    .--small & {
      right: ${spacingByChar(0.5)};
      font-size: ${fontSize.S};
    }
  `}
`;
const BlankOptgroup = styled_components_1.default.optgroup `
  display: none;
`;
//# sourceMappingURL=Select.js.map