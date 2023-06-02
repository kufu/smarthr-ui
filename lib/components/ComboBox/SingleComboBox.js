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
exports.SingleComboBox = void 0;
const react_1 = __importStar(require("react"));
const react_innertext_1 = __importDefault(require("react-innertext"));
const styled_components_1 = __importStar(require("styled-components"));
const useClick_1 = require("../../hooks/useClick");
const useTheme_1 = require("../../hooks/useTheme");
const Button_1 = require("../Button");
const Icon_1 = require("../Icon");
const Input_1 = require("../Input");
const ComboBoxContext_1 = require("./ComboBoxContext");
const useClassNames_1 = require("./useClassNames");
const useListBox_1 = require("./useListBox");
const useOptions_1 = require("./useOptions");
const DESTROY_BUTTON_TEXT = '削除';
function SingleComboBox({ items, selectedItem, defaultItem, name, disabled = false, required = false, prefix, error = false, creatable = false, placeholder = '', dropdownHelpMessage, isLoading, width = 'auto', dropdownWidth = 'auto', className = '', onChange, onChangeInput, onAdd, onSelect, onClear, onClearClick, onChangeSelected, decorators, inputAttributes, ...props }) {
    const theme = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useSingleComboBoxClassNames)();
    const outerRef = (0, react_1.useRef)(null);
    const inputRef = (0, react_1.useRef)(null);
    const clearButtonRef = (0, react_1.useRef)(null);
    const [isFocused, setIsFocused] = (0, react_1.useState)(false);
    const [isExpanded, setIsExpanded] = (0, react_1.useState)(false);
    const [inputValue, setInputValue] = (0, react_1.useState)('');
    const [isComposing, setIsComposing] = (0, react_1.useState)(false);
    const [isEditing, setIsEditing] = (0, react_1.useState)(false);
    const { options } = (0, useOptions_1.useOptions)({
        items,
        selected: selectedItem,
        creatable,
        inputValue,
        isFilteringDisabled: !isEditing,
    });
    const { renderListBox, activeOption, handleKeyDown: handleListBoxKeyDown, listBoxId, listBoxRef, } = (0, useListBox_1.useListBox)({
        options,
        dropdownHelpMessage,
        dropdownWidth,
        onAdd,
        onSelect: (0, react_1.useCallback)((selected) => {
            onSelect && onSelect(selected);
            onChangeSelected && onChangeSelected(selected);
            // HINT: Dropdown系コンポーネント内でComboBoxを使うと、選択肢がportalで表現されている関係上Dropdownが閉じてしまう
            // requestAnimationFrameを追加、処理を遅延させることで正常に閉じる/閉じないの判定を行えるようにする
            requestAnimationFrame(() => {
                setIsExpanded(false);
            });
            setIsEditing(false);
        }, [onChangeSelected, onSelect]),
        isExpanded,
        isLoading,
        triggerRef: outerRef,
        decorators,
    });
    const focus = (0, react_1.useCallback)(() => {
        setIsFocused(true);
        if (!isFocused) {
            setIsExpanded(true);
        }
    }, [isFocused]);
    const unfocus = (0, react_1.useCallback)(() => {
        setIsFocused(false);
        setIsExpanded(false);
        setIsEditing(false);
        if (!selectedItem && defaultItem) {
            setInputValue((0, react_innertext_1.default)(defaultItem.label));
            onSelect && onSelect(defaultItem);
        }
    }, [selectedItem, defaultItem, onSelect]);
    const onClickClear = (0, react_1.useCallback)((e) => {
        e.stopPropagation();
        let isExecutedPreventDefault = false;
        onClearClick &&
            onClearClick({
                ...e,
                preventDefault: () => {
                    e.preventDefault();
                    isExecutedPreventDefault = true;
                },
            });
        if (!isExecutedPreventDefault) {
            onClear && onClear();
            onChangeSelected && onChangeSelected(null);
            inputRef.current?.focus();
            setIsFocused(true);
            setIsExpanded(true);
        }
    }, [onClearClick, onClear, onChangeSelected]);
    const onClickInput = (0, react_1.useCallback)((e) => {
        if (disabled) {
            e.stopPropagation();
            return;
        }
        focus();
        if (inputRef.current) {
            inputRef.current.focus();
        }
        if (!isExpanded) {
            setIsExpanded(true);
        }
    }, [disabled, inputRef, isExpanded, setIsExpanded, focus]);
    const actualOnChangeInput = (0, react_1.useCallback)((e) => {
        if (onChange)
            onChange(e);
        if (onChangeInput)
            onChangeInput(e);
        if (!isEditing)
            setIsEditing(true);
        const { value } = e.currentTarget;
        setInputValue(value);
        if (value === '') {
            onClear && onClear();
            onChangeSelected && onChangeSelected(null);
        }
    }, [isEditing, setIsEditing, setInputValue, onChange, onChangeInput, onClear, onChangeSelected]);
    const onFocus = (0, react_1.useCallback)(() => {
        if (!isFocused) {
            focus();
        }
    }, [isFocused, focus]);
    const onCompositionStart = (0, react_1.useCallback)(() => setIsComposing(true), [setIsComposing]);
    const onCompositionEnd = (0, react_1.useCallback)(() => setIsComposing(false), [setIsComposing]);
    const onKeyDownInput = (0, react_1.useCallback)((e) => {
        if (isComposing) {
            return;
        }
        if (['Escape', 'Esc'].includes(e.key)) {
            if (isExpanded) {
                e.stopPropagation();
                setIsExpanded(false);
            }
        }
        else if (e.key === 'Tab') {
            unfocus();
        }
        else {
            if (['Down', 'ArrowDown', 'Up', 'ArrowUp'].includes(e.key)) {
                e.preventDefault();
            }
            inputRef.current?.focus();
            if (!isExpanded) {
                setIsExpanded(true);
            }
        }
        handleListBoxKeyDown(e);
    }, [isComposing, isExpanded, setIsExpanded, unfocus, handleListBoxKeyDown]);
    const caretIconColor = (0, react_1.useMemo)(() => {
        if (isFocused)
            return theme.color.TEXT_BLACK;
        if (disabled)
            return theme.color.TEXT_DISABLED;
        return theme.color.TEXT_GREY;
    }, [disabled, isFocused, theme]);
    (0, useClick_1.useClick)([outerRef, listBoxRef, clearButtonRef], (0, react_1.useCallback)(() => {
        if (!isFocused && onSelect && !selectedItem && defaultItem) {
            onSelect(defaultItem);
        }
    }, [isFocused, selectedItem, onSelect, defaultItem]), (0, react_1.useCallback)(() => {
        unfocus();
    }, [unfocus]));
    (0, react_1.useEffect)(() => {
        if (selectedItem) {
            setInputValue((0, react_innertext_1.default)(selectedItem.label));
        }
        else {
            setInputValue('');
        }
        if (isFocused && inputRef.current) {
            inputRef.current.focus();
        }
        else if (!selectedItem && defaultItem) {
            onSelect && onSelect(defaultItem);
        }
    }, [isFocused, selectedItem, defaultItem, onSelect]);
    const needsClearButton = selectedItem !== null && !disabled;
    const contextValue = (0, react_1.useMemo)(() => ({
        listBoxClassNames: classNames.listBox,
    }), [classNames.listBox]);
    return (react_1.default.createElement(ComboBoxContext_1.ComboBoxContext.Provider, { value: contextValue },
        react_1.default.createElement(Container, { ...props, ref: outerRef, className: `${disabled ? 'disabled' : ''} ${className} ${classNames.wrapper}`, "$width": width, role: "combobox", "aria-haspopup": "listbox", "aria-controls": listBoxId, "aria-expanded": isFocused, "aria-invalid": error || undefined },
            react_1.default.createElement(StyledInput, { ...inputAttributes, placeholder: placeholder, type: "text", name: name, value: inputValue, disabled: disabled, required: required, prefix: prefix, error: error, suffix: react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(ClearButton, { type: "button", onClick: onClickClear, ref: clearButtonRef, themes: theme, className: `${needsClearButton ? '' : 'hidden'} ${classNames.clearButton}` },
                        react_1.default.createElement(Icon_1.FaTimesCircleIcon, { color: theme.color.TEXT_BLACK, alt: decorators?.destroyButtonIconAlt?.(DESTROY_BUTTON_TEXT) || DESTROY_BUTTON_TEXT })),
                    react_1.default.createElement(CaretDownLayout, { themes: theme, onClick: onClickInput },
                        react_1.default.createElement(CaretDownWrapper, { themes: theme },
                            react_1.default.createElement(Icon_1.FaCaretDownIcon, { color: caretIconColor })))), onClick: onClickInput, onChange: actualOnChangeInput, onFocus: onFocus, onCompositionStart: onCompositionStart, onCompositionEnd: onCompositionEnd, onKeyDown: onKeyDownInput, ref: inputRef, autoComplete: "off", "aria-activedescendant": activeOption?.id, "aria-autocomplete": "list", className: classNames.input }),
            renderListBox())));
}
exports.SingleComboBox = SingleComboBox;
const Container = styled_components_1.default.div `
  display: inline-block;
  width: ${({ $width = 'auto' }) => (typeof $width === 'number' ? `${$width}px` : $width)};
  &.disabled {
    cursor: not-allowed;
  }
`;
const StyledInput = (0, styled_components_1.default)(Input_1.Input) `
  width: 100%;
`;
const CaretDownLayout = styled_components_1.default.span(({ themes }) => {
    const { spacingByChar } = themes;
    const space = spacingByChar(0.5);
    return (0, styled_components_1.css) `
    height: 100%;
    box-sizing: border-box;
    padding: ${space};
    padding-left: 0;
    margin-right: -${space};
    cursor: pointer;
  `;
});
const CaretDownWrapper = styled_components_1.default.span(({ themes }) => {
    const { border, spacingByChar } = themes;
    return (0, styled_components_1.css) `
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    box-sizing: border-box;
    padding-left: ${spacingByChar(0.5)};
    border-left: ${border.shorthand};
  `;
});
const ClearButton = (0, styled_components_1.default)(Button_1.UnstyledButton) `
  ${({ themes }) => {
    const { shadow, spacingByChar } = themes;
    return (0, styled_components_1.css) `
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 0 ${spacingByChar(0.5)};
      cursor: pointer;
      &.hidden {
        display: none;
      }

      &:focus-visible {
        box-shadow: unset;
      }

      &:focus-visible > svg {
        border-radius: 50%;
        ${shadow.focusIndicatorStyles};
      }
    `;
}}
`;
//# sourceMappingURL=SingleComboBox.js.map