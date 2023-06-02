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
exports.Input = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const useClassNames_1 = require("./useClassNames");
exports.Input = (0, react_1.forwardRef)(({ onFocus, onBlur, autoFocus, prefix, suffix, className = '', width, readOnly, bgColor, ...props }, ref) => {
    const theme = (0, useTheme_1.useTheme)();
    const innerRef = (0, react_1.useRef)(null);
    (0, react_1.useImperativeHandle)(ref, () => innerRef.current);
    const handleFocus = (0, react_1.useMemo)(() => {
        if (!onFocus) {
            return undefined;
        }
        return (e) => onFocus(e);
    }, [onFocus]);
    const handleBlur = (0, react_1.useMemo)(() => {
        if (!onBlur) {
            return undefined;
        }
        return (e) => onBlur(e);
    }, [onBlur]);
    const handleWheel = (0, react_1.useMemo)(() => (props.type === 'number' ? disableWheel : undefined), [props.type]);
    (0, react_1.useEffect)(() => {
        if (autoFocus && innerRef.current) {
            innerRef.current.focus();
        }
    }, [autoFocus]);
    const classNames = (0, useClassNames_1.useClassNames)();
    return (react_1.default.createElement(Wrapper, { themes: theme, "$width": width, "$readOnly": readOnly, bgColor: bgColor, "$disabled": props.disabled, error: props.error, onClick: () => innerRef.current?.focus(), className: `${className} ${classNames.wrapper}` },
        prefix && (react_1.default.createElement(Affix, { themes: theme, className: classNames.prefix }, prefix)),
        react_1.default.createElement(StyledInput, { ...props, onFocus: handleFocus, onBlur: handleBlur, onWheel: handleWheel, readOnly: readOnly, ref: innerRef, themes: theme, "aria-invalid": props.error || undefined, className: classNames.input }),
        suffix && (react_1.default.createElement(Affix, { themes: theme, className: classNames.suffix }, suffix))));
});
const disableWheel = (e) => {
    // wheel イベントに preventDefault はないため
    e.target && e.target.blur();
};
const Wrapper = styled_components_1.default.span `
  ${({ themes: { border, color, radius, shadow, space }, $width = 'auto', $readOnly, $disabled, error, bgColor, }) => (0, styled_components_1.css) `
    cursor: text;
    box-sizing: border-box;
    display: inline-flex;
    gap: ${space(0.5)};
    align-items: center;
    border-radius: ${radius.m};
    border: ${border.shorthand};
    background-color: ${bgColor ? color[bgColor] : color.WHITE};
    padding-inline: ${space(0.5)};
    width: ${typeof $width === 'number' ? `${$width}px` : $width};

    @media (prefers-contrast: more) {
      & {
        border: ${border.highContrast};
      }
    }

    &:focus-within {
      ${shadow.focusIndicatorStyles};
    }

    ${error &&
    (0, styled_components_1.css) `
      border-color: ${color.DANGER};
    `}
    ${$readOnly &&
    (0, styled_components_1.css) `
      border-color: ${bgColor ? color[bgColor] : color.BACKGROUND};
      background-color: ${bgColor ? color[bgColor] : color.BACKGROUND};
    `}
    ${$disabled &&
    (0, styled_components_1.css) `
      pointer-events: none;
      border-color: ${color.disableColor(color.BORDER)};
      background-color: ${color.hoverColor(color.WHITE)};
    `}
  `}
`;
const StyledInput = styled_components_1.default.input `
  ${({ themes: { fontSize, leading, color, space } }) => (0, styled_components_1.css) `
    flex-grow: 1;

    display: inline-block;
    outline: none;
    border: none;
    background-color: transparent;
    padding-block: ${space(0.75)};
    font-size: ${fontSize.M};
    line-height: ${leading.NONE};
    color: ${color.TEXT_BLACK};
    width: 100%;

    /* font-size * line-height で高さが思うように行かないので、相対値の font-size で高さを指定 */
    height: ${fontSize.M};

    &::placeholder {
      color: ${color.TEXT_GREY};
    }

    &[disabled] {
      color: ${color.TEXT_DISABLED};
      -webkit-text-fill-color: ${color.TEXT_DISABLED};
      opacity: 1;
    }
  `}
`;
const Affix = styled_components_1.default.span `
  ${({ themes: { color } }) => (0, styled_components_1.css) `
    flex-shrink: 0;

    display: flex;
    align-items: center;
    color: ${color.TEXT_GREY};
  `}
`;
//# sourceMappingURL=Input.js.map