import React, { useCallback, useEffect, useMemo, useRef, useState, } from 'react';
import styled, { css } from 'styled-components';
import { useId } from '../../hooks/useId';
import { useOuterClick } from '../../hooks/useOuterClick';
import { useTheme } from '../../hooks/useTheme';
import { FaCaretDownIcon } from '../Icon';
import { ComboBoxContext } from './ComboBoxContext';
import { MultiSelectedItem } from './MultiSelectedItem';
import { hasParentElementByClassName } from './multiComboBoxHelper';
import { useMultiComboBoxClassNames } from './useClassNames';
import { useFocusControl } from './useFocusControl';
import { useListBox } from './useListBox';
import { useOptions } from './useOptions';
const SELECTED_LIST_ARIA_LABEL = '選択済みアイテム';
export function MultiComboBox({ items, selectedItems, name, disabled = false, required = false, error = false, creatable = false, placeholder = '', dropdownHelpMessage, isLoading, selectedItemEllipsis, width = 'auto', dropdownWidth = 'auto', inputValue: controlledInputValue, className = '', onChange, onChangeInput, onAdd, onDelete, onSelect, onChangeSelected, onFocus, onBlur, decorators, inputAttributes, ...props }) {
    const theme = useTheme();
    const classNames = useMultiComboBoxClassNames();
    const outerRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const isInputControlled = useMemo(() => controlledInputValue !== undefined, [controlledInputValue]);
    const [uncontrolledInputValue, setUncontrolledInputValue] = useState('');
    const inputValue = isInputControlled ? controlledInputValue : uncontrolledInputValue;
    const [isComposing, setIsComposing] = useState(false);
    const { options } = useOptions({
        items,
        selected: selectedItems,
        creatable,
        inputValue,
    });
    const handleDelete = useCallback((item) => {
        // HINT: Dropdown系コンポーネント内でComboBoxを使うと、選択肢がportalで表現されている関係上Dropdownが閉じてしまう
        // requestAnimationFrameを追加、処理を遅延させることで正常に閉じる/閉じないの判定を行えるようにする
        requestAnimationFrame(() => {
            onDelete && onDelete(item);
            onChangeSelected &&
                onChangeSelected(selectedItems.filter((selected) => selected.label !== item.label || selected.value !== item.value));
        });
    }, [onChangeSelected, onDelete, selectedItems]);
    const handleSelect = useCallback((selected) => {
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
    const { renderListBox, activeOption, handleKeyDown: handleListBoxKeyDown, listBoxId, listBoxRef, } = useListBox({
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
    const { deletionButtonRefs, inputRef, focusPrevDeletionButton, focusNextDeletionButton, resetDeletionButtonFocus, } = useFocusControl(selectedItems.length);
    const focus = useCallback(() => {
        onFocus && onFocus();
        setIsFocused(true);
    }, [onFocus]);
    const blur = useCallback(() => {
        if (!isFocused)
            return;
        onBlur && onBlur();
        setIsFocused(false);
        resetDeletionButtonFocus();
    }, [isFocused, onBlur, resetDeletionButtonFocus]);
    const caretIconColor = useMemo(() => {
        if (isFocused)
            return theme.color.TEXT_BLACK;
        if (disabled)
            return theme.color.TEXT_DISABLED;
        return theme.color.TEXT_GREY;
    }, [disabled, isFocused, theme]);
    useOuterClick([outerRef, listBoxRef], blur);
    useEffect(() => {
        if (!isInputControlled) {
            setUncontrolledInputValue('');
        }
        if (isFocused && inputRef.current) {
            inputRef.current.focus();
        }
    }, [inputRef, isFocused, isInputControlled, selectedItems]);
    const handleKeyDown = useCallback((e) => {
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
    const handleInputKeyDown = useCallback((e) => {
        if (e.key === 'Down' || e.key === 'ArrowDown' || e.key === 'Up' || e.key === 'ArrowUp') {
            // 上下キー入力はリストボックスの activeDescendant の移動に用いるため、input 内では作用させない
            e.preventDefault();
        }
    }, []);
    const contextValue = useMemo(() => ({
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
    const selectedListId = useId();
    return (React.createElement(ComboBoxContext.Provider, { value: contextValue },
        React.createElement(Container, { ...props, themes: theme, width: width, ref: outerRef, className: wrapperClassNames, onClick: (e) => {
                if (!hasParentElementByClassName(e.target, classNames.deleteButton) &&
                    !disabled &&
                    !isFocused) {
                    focus();
                }
            }, onKeyDown: handleKeyDown, role: "group" },
            React.createElement(InputArea, { themes: theme },
                React.createElement(SelectedList, { id: selectedListId, "aria-label": decorators?.selectedListAriaLabel?.(SELECTED_LIST_ARIA_LABEL) ||
                        SELECTED_LIST_ARIA_LABEL, className: classNames.selectedList }, selectedItems.map((selectedItem, i) => (React.createElement("li", { key: `${selectedItem.label}-${selectedItem.value}` },
                    React.createElement(MultiSelectedItem, { item: selectedItem, disabled: disabled, onDelete: handleDelete, enableEllipsis: selectedItemEllipsis, buttonRef: deletionButtonRefs[i], decorators: decorators }))))),
                React.createElement(InputWrapper, { className: isFocused ? undefined : 'hidden' },
                    React.createElement(Input, { ...inputAttributes, type: "text", name: name, value: inputValue, disabled: disabled, required: required, ref: inputRef, themes: theme, onChange: (e) => {
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
                selectedItems.length === 0 && placeholder && !isFocused && (React.createElement(Placeholder, { themes: theme, className: classNames.placeholder }, placeholder))),
            React.createElement(Suffix, { themes: theme, disabled: disabled },
                React.createElement(FaCaretDownIcon, { color: caretIconColor })),
            renderListBox())));
}
const Container = styled.div `
  ${({ themes, width }) => {
    const { border, radius, color, shadow, spacingByChar } = themes;
    return css `
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
const InputArea = styled.div `
  ${({ themes: { spacingByChar } }) => css `
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
const SelectedList = styled.ul `
  display: contents;
  list-style: none;
  li {
    /** 選択済みアイテムのラベルの省略表示のために幅を計算させる */
    min-width: 0;
  }
`;
const InputWrapper = styled.div `
  &.hidden {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  flex: 1;
  display: flex;
  align-items: center;
`;
const Input = styled.input `
  ${({ themes }) => {
    const { color, fontSize, spacingByChar } = themes;
    return css `
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
const Placeholder = styled.p `
  ${({ themes }) => {
    const { fontSize } = themes;
    return css `
      margin: 0;
      align-self: center;
      font-size: ${fontSize.M};
    `;
}}
`;
const Suffix = styled.div `
  ${({ themes: { color, spacingByChar }, disabled }) => {
    const space = spacingByChar(0.5);
    return css `
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