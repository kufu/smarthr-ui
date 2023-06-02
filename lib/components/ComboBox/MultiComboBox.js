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
exports.MultiComboBox = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useId_1 = require("../../hooks/useId");
const useOuterClick_1 = require("../../hooks/useOuterClick");
const useTheme_1 = require("../../hooks/useTheme");
const Icon_1 = require("../Icon");
const ComboBoxContext_1 = require("./ComboBoxContext");
const MultiSelectedItem_1 = require("./MultiSelectedItem");
const multiComboBoxHelper_1 = require("./multiComboBoxHelper");
const useClassNames_1 = require("./useClassNames");
const useFocusControl_1 = require("./useFocusControl");
const useListBox_1 = require("./useListBox");
const useOptions_1 = require("./useOptions");
const SELECTED_LIST_ARIA_LABEL = '選択済みアイテム';
function MultiComboBox({ items, selectedItems, name, disabled = false, required = false, error = false, creatable = false, placeholder = '', dropdownHelpMessage, isLoading, selectedItemEllipsis, width = 'auto', dropdownWidth = 'auto', inputValue: controlledInputValue, className = '', onChange, onChangeInput, onAdd, onDelete, onSelect, onChangeSelected, onFocus, onBlur, decorators, inputAttributes, ...props }) {
    const theme = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useMultiComboBoxClassNames)();
    const outerRef = (0, react_1.useRef)(null);
    const [isFocused, setIsFocused] = (0, react_1.useState)(false);
    const isInputControlled = (0, react_1.useMemo)(() => controlledInputValue !== undefined, [controlledInputValue]);
    const [uncontrolledInputValue, setUncontrolledInputValue] = (0, react_1.useState)('');
    const inputValue = isInputControlled ? controlledInputValue : uncontrolledInputValue;
    const [isComposing, setIsComposing] = (0, react_1.useState)(false);
    const { options } = (0, useOptions_1.useOptions)({
        items,
        selected: selectedItems,
        creatable,
        inputValue,
    });
    const handleDelete = (0, react_1.useCallback)((item) => {
        // HINT: Dropdown系コンポーネント内でComboBoxを使うと、選択肢がportalで表現されている関係上Dropdownが閉じてしまう
        // requestAnimationFrameを追加、処理を遅延させることで正常に閉じる/閉じないの判定を行えるようにする
        requestAnimationFrame(() => {
            onDelete && onDelete(item);
            onChangeSelected &&
                onChangeSelected(selectedItems.filter((selected) => selected.label !== item.label || selected.value !== item.value));
        });
    }, [onChangeSelected, onDelete, selectedItems]);
    const handleSelect = (0, react_1.useCallback)((selected) => {
        // HINT: Dropdown系コンポーネント内でComboBoxを使うと、選択肢がportalで表現されている関係上Dropdownが閉じてしまう
        // requestAnimationFrameを追加、処理を遅延させることで正常に閉じる/閉じないの判定を行えるようにする
        requestAnimationFrame(() => {
            const matchedSelectedItem = selectedItems.find((item) => item.label === selected.label && item.value === selected.value);
            if (matchedSelectedItem !== undefined) {
                if (matchedSelectedItem.deletable !== false) {
                    handleDelete(selected);
                }
            }
            else {
                onSelect && onSelect(selected);
                onChangeSelected && onChangeSelected(selectedItems.concat(selected));
            }
        });
    }, [handleDelete, onChangeSelected, onSelect, selectedItems]);
    const { renderListBox, activeOption, handleKeyDown: handleListBoxKeyDown, listBoxId, listBoxRef, } = (0, useListBox_1.useListBox)({
        options,
        dropdownHelpMessage,
        dropdownWidth,
        onAdd,
        onSelect: handleSelect,
        isExpanded: isFocused,
        isLoading,
        triggerRef: outerRef,
        decorators,
    });
    const { deletionButtonRefs, inputRef, focusPrevDeletionButton, focusNextDeletionButton, resetDeletionButtonFocus, } = (0, useFocusControl_1.useFocusControl)(selectedItems.length);
    const focus = (0, react_1.useCallback)(() => {
        onFocus && onFocus();
        setIsFocused(true);
    }, [onFocus]);
    const blur = (0, react_1.useCallback)(() => {
        if (!isFocused)
            return;
        onBlur && onBlur();
        setIsFocused(false);
        resetDeletionButtonFocus();
    }, [isFocused, onBlur, resetDeletionButtonFocus]);
    const caretIconColor = (0, react_1.useMemo)(() => {
        if (isFocused)
            return theme.color.TEXT_BLACK;
        if (disabled)
            return theme.color.TEXT_DISABLED;
        return theme.color.TEXT_GREY;
    }, [disabled, isFocused, theme]);
    (0, useOuterClick_1.useOuterClick)([outerRef, listBoxRef], blur);
    (0, react_1.useEffect)(() => {
        if (!isInputControlled) {
            setUncontrolledInputValue('');
        }
        if (isFocused && inputRef.current) {
            inputRef.current.focus();
        }
    }, [inputRef, isFocused, isInputControlled, selectedItems]);
    const handleKeyDown = (0, react_1.useCallback)((e) => {
        if (isComposing) {
            return;
        }
        else if (e.key === 'Escape' || e.key === 'Esc') {
            e.stopPropagation();
            blur();
        }
        else if (e.key === 'Tab') {
            if (isFocused) {
                // フォーカスがコンポーネントを抜けるように先に input をフォーカスしておく
                inputRef.current?.focus();
            }
            blur();
        }
        else if (e.key === 'Left' || e.key === 'ArrowLeft') {
            e.stopPropagation();
            focusPrevDeletionButton();
        }
        else if (e.key === 'Right' || e.key === 'ArrowRight') {
            e.stopPropagation();
            focusNextDeletionButton();
        }
        else {
            e.stopPropagation();
            inputRef.current?.focus();
            resetDeletionButtonFocus();
        }
        handleListBoxKeyDown(e);
    }, [
        blur,
        focusNextDeletionButton,
        focusPrevDeletionButton,
        handleListBoxKeyDown,
        inputRef,
        isComposing,
        isFocused,
        resetDeletionButtonFocus,
    ]);
    const handleInputKeyDown = (0, react_1.useCallback)((e) => {
        if (e.key === 'Down' || e.key === 'ArrowDown' || e.key === 'Up' || e.key === 'ArrowUp') {
            // 上下キー入力はリストボックスの activeDescendant の移動に用いるため、input 内では作用させない
            e.preventDefault();
        }
    }, []);
    const contextValue = (0, react_1.useMemo)(() => ({
        listBoxClassNames: classNames.listBox,
    }), [classNames.listBox]);
    const wrapperClassNames = [
        className,
        isFocused && 'focused',
        error && 'invalid',
        disabled && 'disabled',
        classNames.wrapper,
    ]
        .filter((text) => text !== false && text !== '')
        .join(' ');
    const selectedListId = (0, useId_1.useId)();
    return (react_1.default.createElement(ComboBoxContext_1.ComboBoxContext.Provider, { value: contextValue },
        react_1.default.createElement(Container, { ...props, themes: theme, width: width, ref: outerRef, className: wrapperClassNames, onClick: (e) => {
                if (!(0, multiComboBoxHelper_1.hasParentElementByClassName)(e.target, classNames.deleteButton) &&
                    !disabled &&
                    !isFocused) {
                    focus();
                }
            }, onKeyDown: handleKeyDown, role: "group" },
            react_1.default.createElement(InputArea, { themes: theme },
                react_1.default.createElement(SelectedList, { id: selectedListId, "aria-label": decorators?.selectedListAriaLabel?.(SELECTED_LIST_ARIA_LABEL) ||
                        SELECTED_LIST_ARIA_LABEL, className: classNames.selectedList }, selectedItems.map((selectedItem, i) => (react_1.default.createElement("li", { key: `${selectedItem.label}-${selectedItem.value}` },
                    react_1.default.createElement(MultiSelectedItem_1.MultiSelectedItem, { item: selectedItem, disabled: disabled, onDelete: handleDelete, enableEllipsis: selectedItemEllipsis, buttonRef: deletionButtonRefs[i], decorators: decorators }))))),
                react_1.default.createElement(InputWrapper, { className: isFocused ? undefined : 'hidden' },
                    react_1.default.createElement(Input, { ...inputAttributes, type: "text", name: name, value: inputValue, disabled: disabled, required: required, ref: inputRef, themes: theme, onChange: (e) => {
                            if (onChange)
                                onChange(e);
                            if (onChangeInput)
                                onChangeInput(e);
                            if (!isInputControlled) {
                                setUncontrolledInputValue(e.currentTarget.value);
                            }
                        }, onFocus: () => {
                            resetDeletionButtonFocus();
                            if (!isFocused) {
                                focus();
                            }
                        }, onCompositionStart: () => setIsComposing(true), onCompositionEnd: () => setIsComposing(false), onKeyDown: handleInputKeyDown, autoComplete: "off", tabIndex: 0, role: "combobox", "aria-activedescendant": activeOption?.id, "aria-controls": `${listBoxId} ${selectedListId}`, "aria-haspopup": "listbox", "aria-expanded": isFocused, "aria-invalid": error || undefined, "aria-disabled": disabled, "aria-autocomplete": "list", className: classNames.input })),
                selectedItems.length === 0 && placeholder && !isFocused && (react_1.default.createElement(Placeholder, { themes: theme, className: classNames.placeholder }, placeholder))),
            react_1.default.createElement(Suffix, { themes: theme, disabled: disabled },
                react_1.default.createElement(Icon_1.FaCaretDownIcon, { color: caretIconColor })),
            renderListBox())));
}
exports.MultiComboBox = MultiComboBox;
const Container = styled_components_1.default.div `
  ${({ themes, width }) => {
    const { border, radius, color, shadow, spacingByChar } = themes;
    return (0, styled_components_1.css) `
      display: inline-flex;
      min-width: calc(62px + 32px + ${spacingByChar(0.5)} * 2);
      width: ${typeof width === 'number' ? `${width}px` : width};
      min-height: 40px;
      border-radius: ${radius.m};
      border: ${border.shorthand};
      box-sizing: border-box;
      background-color: ${color.WHITE};
      color: ${color.TEXT_GREY};
      cursor: text;

      @media (prefers-contrast: more) {
        & {
          border: ${border.highContrast};
        }
      }

      &.focused {
        box-shadow: ${shadow.OUTLINE};
      }

      &.invalid {
        border-color: ${color.DANGER};
      }

      &.disabled {
        cursor: not-allowed;
        border-color: ${color.disableColor(color.BORDER)};
        background-color: ${color.hoverColor(color.WHITE)};
        color: ${color.TEXT_DISABLED};
      }
    `;
}}
`;
const InputArea = styled_components_1.default.div `
  ${({ themes: { spacingByChar } }) => (0, styled_components_1.css) `
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    gap: ${spacingByChar(0.5)};
    min-height: calc(1em + ${spacingByChar(0.5)} * 2);
    max-height: 300px;
    margin: ${spacingByChar(0.25)} ${spacingByChar(0.5)};
    overflow-y: auto;
  `}
`;
const SelectedList = styled_components_1.default.ul `
  display: contents;
  list-style: none;
  li {
    /** 選択済みアイテムのラベルの省略表示のために幅を計算させる */
    min-width: 0;
  }
`;
const InputWrapper = styled_components_1.default.div `
  &.hidden {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  flex: 1;
  display: flex;
  align-items: center;
`;
const Input = styled_components_1.default.input `
  ${({ themes }) => {
    const { color, fontSize, spacingByChar } = themes;
    return (0, styled_components_1.css) `
      min-width: 80px;
      width: 100%;
      min-height: calc(1em + ${spacingByChar(0.5)} * 2);
      border: none;
      font-size: ${fontSize.M};
      color: ${color.TEXT_BLACK};
      box-sizing: border-box;
      outline: none;
      &[disabled] {
        display: none;
      }
    `;
}}
`;
const Placeholder = styled_components_1.default.p `
  ${({ themes }) => {
    const { fontSize } = themes;
    return (0, styled_components_1.css) `
      margin: 0;
      align-self: center;
      font-size: ${fontSize.M};
    `;
}}
`;
const Suffix = styled_components_1.default.div `
  ${({ themes: { color, spacingByChar }, disabled }) => {
    const space = spacingByChar(0.5);
    return (0, styled_components_1.css) `
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: ${space};
      padding-left: calc(${space} + 1px);
      box-sizing: border-box;
      cursor: ${disabled ? 'not-allowed' : 'pointer'};

      &::before {
        content: '';
        position: absolute;
        top: ${space};
        left: 0;
        display: block;
        width: 1px;
        background-color: ${color.BORDER};
        height: calc(100% - ${space} * 2);
      }
    `;
}}
`;
//# sourceMappingURL=MultiComboBox.js.map