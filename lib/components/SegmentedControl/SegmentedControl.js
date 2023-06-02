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
exports.SegmentedControl = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const Button_1 = require("../Button");
const useClassNames_1 = require("./useClassNames");
const SegmentedControl = ({ options, value, onClickOption, size = 'default', isSquare = false, className = '', ...props }) => {
    const themes = (0, useTheme_1.useTheme)();
    const [isFocused, setIsFocused] = (0, react_1.useState)(false);
    const containerRef = (0, react_1.useRef)(null);
    const handleKeyDown = (0, react_1.useCallback)((e) => {
        if (!isFocused || !containerRef.current || !document.activeElement) {
            return;
        }
        const radios = Array.from(containerRef.current.querySelectorAll('[role="radio"]:not(:disabled)'));
        if (radios.length < 2) {
            return;
        }
        const focusedIndex = radios.indexOf(document.activeElement);
        if (focusedIndex === -1) {
            return;
        }
        switch (e.key) {
            case 'Down':
            case 'ArrowDown':
            case 'Right':
            case 'ArrowRight': {
                const nextIndex = focusedIndex + 1;
                const nextRadio = radios[nextIndex % radios.length];
                if (nextRadio instanceof HTMLButtonElement) {
                    nextRadio.focus();
                }
                break;
            }
            case 'Up':
            case 'ArrowUp':
            case 'Left':
            case 'ArrowLeft': {
                const nextIndex = focusedIndex - 1;
                const nextRadio = radios[(nextIndex + radios.length) % radios.length];
                if (nextRadio instanceof HTMLButtonElement) {
                    nextRadio.focus();
                }
                break;
            }
        }
    }, [isFocused]);
    (0, react_1.useEffect)(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);
    const includesSelected = value && options.some((option) => option.value === value);
    const getRovingTabIndex = (0, react_1.useCallback)((option, index) => {
        if (isFocused) {
            return -1;
        }
        if (!includesSelected) {
            return index === 0 ? 0 : -1;
        }
        return option.value === value ? 0 : -1;
    }, [includesSelected, isFocused, value]);
    const classNames = (0, useClassNames_1.useClassNames)();
    return (react_1.default.createElement(Container, { ...props, className: `${className} ${classNames.wrapper}`, onFocus: () => setIsFocused(true), onBlur: () => setIsFocused(false), ref: containerRef, role: "toolbar" },
        react_1.default.createElement("div", { role: "radiogroup" }, options.map((option, i) => {
            const isSelected = !!value && value === option.value;
            const onClick = onClickOption ? () => onClickOption(option.value) : undefined;
            return (react_1.default.createElement(StyledButton, { "aria-label": option.ariaLabel, key: option.value, disabled: option.disabled, onClick: onClick, size: size, square: isSquare, themes: themes, tabIndex: getRovingTabIndex(option, i), role: "radio", "aria-checked": isSelected, className: classNames.button }, option.content));
        }))));
};
exports.SegmentedControl = SegmentedControl;
const Container = styled_components_1.default.div `
  display: inline-flex;
`;
const StyledButton = (0, styled_components_1.default)(Button_1.Button)(({ themes: { border, color, radius, shadow } }) => (0, styled_components_1.css) `
      margin: 0;
      border-radius: 0;

      &[aria-checked='true'] {
        border-color: ${color.MAIN};
        background-color: ${color.MAIN};
        color: ${color.TEXT_WHITE};
        &.hover {
          border-color: ${color.hoverColor(color.MAIN)};
          background-color: ${color.hoverColor(color.MAIN)};
        }
      }

      &:focus-visible {
        ${shadow.focusIndicatorStyles}
      }
      &:first-child {
        border-top-left-radius: ${radius.m};
        border-bottom-left-radius: ${radius.m};
      }
      &:last-child {
        border-top-right-radius: ${radius.m};
        border-bottom-right-radius: ${radius.m};
      }
      & + & {
        margin-left: -${border.lineWidth};
      }
    `);
//# sourceMappingURL=SegmentedControl.js.map