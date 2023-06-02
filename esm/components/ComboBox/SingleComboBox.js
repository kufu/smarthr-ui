import React, { useCallback, useEffect, useMemo, useRef, useState, } from 'react';
import innerText from 'react-innertext';
import styled, { css } from 'styled-components';
import { useClick } from '../../hooks/useClick';
import { useTheme } from '../../hooks/useTheme';
import { UnstyledButton } from '../Button';
import { FaCaretDownIcon, FaTimesCircleIcon } from '../Icon';
import { Input } from '../Input';
import { ComboBoxContext } from './ComboBoxContext';
import { useSingleComboBoxClassNames } from './useClassNames';
import { useListBox } from './useListBox';
import { useOptions } from './useOptions';
const DESTROY_BUTTON_TEXT = '削除';
export function SingleComboBox({ items, selectedItem, defaultItem, name, disabled = false, required = false, prefix, error = false, creatable = false, placeholder = '', dropdownHelpMessage, isLoading, width = 'auto', dropdownWidth = 'auto', className = '', onChange, onChangeInput, onAdd, onSelect, onClear, onClearClick, onChangeSelected, decorators, inputAttributes, ...props }) {
    const theme = useTheme();
    const classNames = useSingleComboBoxClassNames();
    const outerRef = useRef(null);
    const inputRef = useRef(null);
    const clearButtonRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isComposing, setIsComposing] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { options } = useOptions({
        items,
        selected: selectedItem,
        creatable,
        inputValue,
        isFilteringDisabled: !isEditing,
    });
    const { renderListBox, activeOption, handleKeyDown: handleListBoxKeyDown, listBoxId, listBoxRef, } = useListBox({
        options,
        dropdownHelpMessage,
        dropdownWidth,
        onAdd,
        onSelect: useCallback((selected) => {
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
    const focus = useCallback(() => {
        setIsFocused(true);
        if (!isFocused) {
            setIsExpanded(true);
        }
    }, [isFocused]);
    const unfocus = useCallback(() => {
        setIsFocused(false);
        setIsExpanded(false);
        setIsEditing(false);
        if (!selectedItem && defaultItem) {
            setInputValue(innerText(defaultItem.label));
            onSelect && onSelect(defaultItem);
        }
    }, [selectedItem, defaultItem, onSelect]);
    const onClickClear = useCallback((e) => {
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
    const onClickInput = useCallback((e) => {
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
    const actualOnChangeInput = useCallback((e) => {
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
    const onFocus = useCallback(() => {
        if (!isFocused) {
            focus();
        }
    }, [isFocused, focus]);
    const onCompositionStart = useCallback(() => setIsComposing(true), [setIsComposing]);
    const onCompositionEnd = useCallback(() => setIsComposing(false), [setIsComposing]);
    const onKeyDownInput = useCallback((e) => {
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
    const caretIconColor = useMemo(() => {
        if (isFocused)
            return theme.color.TEXT_BLACK;
        if (disabled)
            return theme.color.TEXT_DISABLED;
        return theme.color.TEXT_GREY;
    }, [disabled, isFocused, theme]);
    useClick([outerRef, listBoxRef, clearButtonRef], useCallback(() => {
        if (!isFocused && onSelect && !selectedItem && defaultItem) {
            onSelect(defaultItem);
        }
    }, [isFocused, selectedItem, onSelect, defaultItem]), useCallback(() => {
        unfocus();
    }, [unfocus]));
    useEffect(() => {
        if (selectedItem) {
            setInputValue(innerText(selectedItem.label));
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
    const contextValue = useMemo(() => ({
        listBoxClassNames: classNames.listBox,
    }), [classNames.listBox]);
    return (React.createElement(ComboBoxContext.Provider, { value: contextValue },
        React.createElement(Container, { ...props, ref: outerRef, className: `${disabled ? 'disabled' : ''} ${className} ${classNames.wrapper}`, "$width": width, role: "combobox", "aria-haspopup": "listbox", "aria-controls": listBoxId, "aria-expanded": isFocused, "aria-invalid": error || undefined },
            React.createElement(StyledInput, { ...inputAttributes, placeholder: placeholder, type: "text", name: name, value: inputValue, disabled: disabled, required: required, prefix: prefix, error: error, suffix: React.createElement(React.Fragment, null,
                    React.createElement(ClearButton, { type: "button", onClick: onClickClear, ref: clearButtonRef, themes: theme, className: `${needsClearButton ? '' : 'hidden'} ${classNames.clearButton}` },
                        React.createElement(FaTimesCircleIcon, { color: theme.color.TEXT_BLACK, alt: decorators?.destroyButtonIconAlt?.(DESTROY_BUTTON_TEXT) || DESTROY_BUTTON_TEXT })),
                    React.createElement(CaretDownLayout, { themes: theme, onClick: onClickInput },
                        React.createElement(CaretDownWrapper, { themes: theme },
                            React.createElement(FaCaretDownIcon, { color: caretIconColor })))), onClick: onClickInput, onChange: actualOnChangeInput, onFocus: onFocus, onCompositionStart: onCompositionStart, onCompositionEnd: onCompositionEnd, onKeyDown: onKeyDownInput, ref: inputRef, autoComplete: "off", "aria-activedescendant": activeOption?.id, "aria-autocomplete": "list", className: classNames.input }),
            renderListBox())));
}
const Container = styled.div `
  display: inline-block;
  width: ${({ $width = 'auto' }) => (typeof $width === 'number' ? `${$width}px` : $width)};
  &.disabled {
    cursor: not-allowed;
  }
`;
const StyledInput = styled(Input) `
  width: 100%;
`;
const CaretDownLayout = styled.span(({ themes }) => {
    const { spacingByChar } = themes;
    const space = spacingByChar(0.5);
    return css `
    height: 100%;
    box-sizing: border-box;
    padding: ${space};
    padding-left: 0;
    margin-right: -${space};
    cursor: pointer;
  `;
});
const CaretDownWrapper = styled.span(({ themes }) => {
    const { border, spacingByChar } = themes;
    return css `
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    box-sizing: border-box;
    padding-left: ${spacingByChar(0.5)};
    border-left: ${border.shorthand};
  `;
});
const ClearButton = styled(UnstyledButton) `
  ${({ themes }) => {
    const { shadow, spacingByChar } = themes;
    return css `
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