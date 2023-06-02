import dayjs from 'dayjs';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState, } from 'react';
import styled, { css } from 'styled-components';
import { useId } from '../../hooks/useId';
import { useOuterClick } from '../../hooks/useOuterClick';
import { useTheme } from '../../hooks/useTheme';
import { Calendar } from '../Calendar';
import { FaCalendarAltIcon } from '../Icon';
import { Input } from '../Input';
import { Portal } from './Portal';
import { parseJpnDateString } from './datePickerHelper';
import { useClassNames } from './useClassNames';
import { useGlobalKeyDown } from './useGlobalKeyDown';
export const DEFAULT_FROM = new Date(1900, 0, 1);
export const DatePicker = forwardRef(({ value, name, from = DEFAULT_FROM, to, disabled, width, error, className = '', parseInput, formatDate, showAlternative, onChangeDate, ...inputAttrs }, ref) => {
    const stringToDate = useCallback((str) => {
        if (!str) {
            return null;
        }
        return parseInput ? parseInput(str) : parseJpnDateString(str);
    }, [parseInput]);
    const dateToString = useCallback((d) => {
        if (formatDate) {
            return formatDate(d);
        }
        if (!d) {
            return '';
        }
        return dayjs(d).format('YYYY/MM/DD');
    }, [formatDate]);
    const dateToAlternativeFormat = useCallback((d) => {
        if (!d || !showAlternative) {
            return null;
        }
        return showAlternative(d);
    }, [showAlternative]);
    const themes = useTheme();
    const [selectedDate, setSelectedDate] = useState(stringToDate(value));
    const inputRef = useRef(null);
    const inputWrapperRef = useRef(null);
    const calendarPortalRef = useRef(null);
    const [inputRect, setInputRect] = useState(null);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [isCalendarShown, setIsCalendarShown] = useState(false);
    const [alternativeFormat, setAlternativeFormat] = useState(null);
    const calenderId = useId();
    useImperativeHandle(ref, () => inputRef.current);
    const updateDate = useCallback((newDate) => {
        if (!inputRef.current ||
            newDate === selectedDate ||
            (newDate && selectedDate && newDate.getTime() === selectedDate.getTime())) {
            // Do not update date if the new date is same with the old one.
            return;
        }
        const isValid = !newDate || dayjs(newDate).isValid();
        const nextDate = isValid ? newDate : null;
        const errors = [];
        if (!isValid) {
            errors.push('INVALID_DATE');
        }
        inputRef.current.value = dateToString(nextDate);
        setAlternativeFormat(dateToAlternativeFormat(nextDate));
        setSelectedDate(nextDate);
        onChangeDate && onChangeDate(nextDate, inputRef.current.value, { errors });
    }, [selectedDate, dateToString, dateToAlternativeFormat, onChangeDate]);
    const switchCalendarVisibility = useCallback((isVisible) => {
        if (!isVisible) {
            setIsCalendarShown(false);
            return;
        }
        if (!inputWrapperRef.current) {
            return;
        }
        setIsCalendarShown(true);
        setInputRect(inputWrapperRef.current.getBoundingClientRect());
    }, []);
    useEffect(() => {
        if (value === undefined || !inputRef.current) {
            return;
        }
        /**
         * Do not format the given value in the following cases
         * - while input element is focused.
         * - if the given value is not date formattable.
         */
        if (!isInputFocused) {
            const newDate = stringToDate(value);
            if (newDate && dayjs(newDate).isValid()) {
                inputRef.current.value = dateToString(newDate);
                setAlternativeFormat(dateToAlternativeFormat(newDate));
                setSelectedDate(newDate);
                return;
            }
            setSelectedDate(null);
        }
        inputRef.current.value = value || '';
    }, [value, isInputFocused, dateToString, dateToAlternativeFormat, stringToDate]);
    useOuterClick([inputWrapperRef, calendarPortalRef], useCallback(() => {
        switchCalendarVisibility(false);
    }, [switchCalendarVisibility]));
    const handleKeyDown = useCallback((e) => {
        if (e.key !== 'Tab' || !inputRef.current || !calendarPortalRef.current) {
            return;
        }
        const calendarButtons = calendarPortalRef.current.querySelectorAll('button');
        if (calendarButtons.length === 0) {
            return;
        }
        const firstCalendarButton = calendarButtons[0];
        const lastCalendarButton = calendarButtons[calendarButtons.length - 1];
        if (isInputFocused) {
            if (e.shiftKey) {
                // move focus from Input to previous elements of DatePicker
                switchCalendarVisibility(false);
                return;
            }
            // move focus from Input to Calendar
            e.preventDefault();
            firstCalendarButton.focus();
            return;
        }
        const currentFocused = Array.from(calendarButtons).find((button) => button === e.target);
        if (e.shiftKey && currentFocused === firstCalendarButton) {
            // move focus from Calendar to Input
            inputRef.current.focus();
            e.preventDefault();
        }
        else if (!e.shiftKey && currentFocused === lastCalendarButton) {
            // move focus from Calendar to next elements of DatePicker
            inputRef.current.focus();
            switchCalendarVisibility(false);
        }
    }, [isInputFocused, switchCalendarVisibility]);
    useGlobalKeyDown(handleKeyDown);
    const caretIconColor = useMemo(() => {
        if (isInputFocused || isCalendarShown)
            return themes.color.TEXT_BLACK;
        if (disabled)
            return themes.color.TEXT_DISABLED;
        return themes.color.TEXT_GREY;
    }, [isCalendarShown, isInputFocused, disabled, themes]);
    const classNames = useClassNames();
    return (React.createElement(Container, { "$width": width, className: `${className} ${classNames.wrapper}`, onClick: () => {
            if (!disabled && !isCalendarShown) {
                switchCalendarVisibility(true);
            }
        }, onKeyDown: (e) => {
            if ((e.key === 'Escape' || e.key === 'Esc') && isCalendarShown) {
                e.stopPropagation();
                requestAnimationFrame(() => {
                    // delay hiding calendar because calendar will be displayed when input is focused
                    switchCalendarVisibility(false);
                });
                inputRef.current && inputRef.current.focus();
            }
        } },
        React.createElement("div", { ref: inputWrapperRef },
            React.createElement(Input, { ...inputAttrs, width: "100%", name: name, onChange: () => {
                    if (isCalendarShown) {
                        switchCalendarVisibility(false);
                    }
                }, onKeyPress: ({ key, currentTarget: { value: inputString } }) => {
                    if (key === 'Enter') {
                        switchCalendarVisibility(!isCalendarShown);
                        const newDate = stringToDate(inputString);
                        updateDate(newDate);
                    }
                }, onFocus: () => {
                    setIsInputFocused(true);
                    switchCalendarVisibility(true);
                }, onBlur: ({ target: { value: inputString } }) => {
                    setIsInputFocused(false);
                    if (inputString === '') {
                        updateDate(null);
                        return;
                    }
                    const newDate = stringToDate(inputString);
                    updateDate(newDate);
                }, suffix: React.createElement(InputSuffixLayout, { themes: themes },
                    React.createElement(InputSuffixWrapper, { themes: themes },
                        showAlternative && (React.createElement(InputSuffixText, { themes: themes }, alternativeFormat)),
                        React.createElement(FaCalendarAltIcon, { color: caretIconColor }))), disabled: disabled, error: error, ref: inputRef, className: classNames.inputContainer, "aria-expanded": isCalendarShown, "aria-controls": calenderId, "aria-haspopup": true })),
        isCalendarShown && inputRect && (React.createElement(Portal, { inputRect: inputRect, ref: calendarPortalRef },
            React.createElement(Calendar, { id: calenderId, value: selectedDate || undefined, from: from, to: to, onSelectDate: (_, selected) => {
                    updateDate(selected);
                    requestAnimationFrame(() => {
                        // delay hiding calendar because calendar will be displayed when input is focused
                        switchCalendarVisibility(false);
                    });
                    inputRef.current && inputRef.current.focus();
                } })))));
});
const Container = styled.div `
  ${({ $width = 'auto' }) => css `
    display: inline-block;
    width: ${typeof $width === 'number' ? `${$width}px` : $width};
  `}
`;
const InputSuffixLayout = styled.span(({ themes: { spacingByChar } }) => {
    return css `
    height: 100%;
    padding: ${spacingByChar(0.5)} 0;
    box-sizing: border-box;
  `;
});
const InputSuffixWrapper = styled.span(({ themes }) => {
    const { fontSize, color, spacingByChar } = themes;
    return css `
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    height: 100%;
    padding-left: ${spacingByChar(0.5)};
    border-left: 1px solid ${color.BORDER};
    font-size: ${fontSize.M};
  `;
});
const InputSuffixText = styled.span(({ themes }) => {
    const { fontSize, color, spacingByChar } = themes;
    return css `
    margin-right: ${spacingByChar(0.5)};
    color: ${color.TEXT_GREY};
    font-size: ${fontSize.S};
  `;
});
//# sourceMappingURL=DatePicker.js.map