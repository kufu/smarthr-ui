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
exports.Textarea = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const createFontSize_1 = require("../../themes/createFontSize");
const useClassNames_1 = require("./useClassNames");
const getStringLength = (value) => {
    const formattedValue = typeof value === 'number' || typeof value === 'string'
        ? `${value}`
        : Array.isArray(value)
            ? value.join(',')
            : '';
    // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt
    const surrogatePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
    return formattedValue.length - (formattedValue.match(surrogatePairs) || []).length;
};
const TEXT_BEFORE_MAXlENGTH_COUNT = 'あと';
const TEXT_AFTER_MAXlENGTH_COUNT = '文字';
exports.Textarea = (0, react_1.forwardRef)(({ autoFocus, maxLength, width, className = '', autoResize = false, maxRows = Infinity, rows = 2, onInput, decorators, ...props }, ref) => {
    const theme = (0, useTheme_1.useTheme)();
    const textareaRef = (0, react_1.useRef)(null);
    const currentValue = props.defaultValue || props.value;
    const [interimRows, setInterimRows] = (0, react_1.useState)(rows);
    const [count, setCount] = (0, react_1.useState)(currentValue ? getStringLength(currentValue) : 0);
    const textAreaWidth = typeof width === 'number' ? `${width}px` : width;
    const beforeMaxLengthCount = (0, react_1.useMemo)(() => decorators?.beforeMaxLengthCount?.(TEXT_BEFORE_MAXlENGTH_COUNT) ||
        TEXT_BEFORE_MAXlENGTH_COUNT, [decorators]);
    const afterMaxLengthCount = (0, react_1.useMemo)(() => decorators?.afterMaxLengthCount?.(TEXT_AFTER_MAXlENGTH_COUNT) || TEXT_AFTER_MAXlENGTH_COUNT, [decorators]);
    (0, react_1.useImperativeHandle)(ref, () => textareaRef.current);
    (0, react_1.useEffect)(() => {
        if (autoFocus && textareaRef && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [autoFocus]);
    const handleKeyup = (0, react_1.useCallback)((event) => {
        setCount(getStringLength(event.currentTarget.value));
    }, []);
    const handleInput = (0, react_1.useCallback)((e) => {
        if (!autoResize) {
            return onInput && onInput(e);
        }
        const previousRows = e.target.rows;
        // 消したことを検知できないので必ず初期化
        e.target.rows = rows;
        const currentRows = Math.floor(e.target.scrollHeight / (createFontSize_1.defaultHtmlFontSize * theme.leading.NORMAL));
        if (previousRows === currentRows) {
            e.target.rows = currentRows;
        }
        else if (maxRows < currentRows) {
            // 最大まで達したとき高さが潰れないように代入
            e.target.rows = maxRows;
        }
        setInterimRows(currentRows < maxRows ? currentRows : maxRows);
        onInput && onInput(e);
    }, [autoResize, maxRows, onInput, rows, theme.leading.NORMAL]);
    const classNames = (0, useClassNames_1.useClassNames)();
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(StyledTextarea, { ...props, ...(maxLength ? { onKeyUp: handleKeyup } : {}), textAreaWidth: textAreaWidth, ref: textareaRef, themes: theme, "aria-invalid": props.error || undefined, className: `${className} ${classNames.textarea}`, rows: interimRows, onInput: handleInput }),
        maxLength && (react_1.default.createElement(Counter, { themes: theme, className: classNames.counter },
            beforeMaxLengthCount,
            react_1.default.createElement("span", { className: maxLength && maxLength - count <= 0 ? 'error' : '' }, maxLength - count),
            afterMaxLengthCount))));
});
const StyledTextarea = styled_components_1.default.textarea `
  ${({ themes: { border, color, leading, fontSize, radius, shadow, spacingByChar }, textAreaWidth = 'auto', error, }) => (0, styled_components_1.css) `
    box-sizing: border-box;
    opacity: 1;
    border-radius: ${radius.m};
    border: ${border.shorthand};
    background-color: ${color.WHITE};
    padding: ${spacingByChar(0.5)};
    font-size: ${fontSize.M};
    line-height: ${leading.NORMAL};
    color: ${color.TEXT_BLACK};
    width: ${textAreaWidth};

    @media (prefers-contrast: more) {
      & {
        border: ${border.highContrast};
      }
    }

    ${error &&
    (0, styled_components_1.css) `
      border-color: ${color.DANGER};
    `}
    &::placeholder {
      color: ${color.TEXT_GREY};
    }
    &:focus-visible {
      ${shadow.focusIndicatorStyles}
    }
    &:disabled {
      background-color: ${color.COLUMN};
      pointer-events: none;

      &,
      &::placeholder {
        color: ${color.TEXT_DISABLED};
      }
    }
  `}
`;
const Counter = styled_components_1.default.div `
  ${({ themes }) => {
    const { fontSize, color } = themes;
    return (0, styled_components_1.css) `
      font-size: ${fontSize.S};
      > span {
        font-weight: bold;
        color: ${color.TEXT_GREY};
        &.error {
          color: ${color.DANGER};
        }
      }
    `;
}}
`;
//# sourceMappingURL=Textarea.js.map