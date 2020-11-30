var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import dayjs from 'dayjs';
import { useTheme } from '../../hooks/useTheme';
import { Input } from '../Input';
import { Icon } from '../Icon';
import { Calendar } from '../Calendar';
import { Portal } from './Portal';
import { useOuterClick } from './useOuterClick';
import { useGlobalKeyDown } from './useGlobalKeyDown';
import { parseJpnDateString } from './datePickerHelper';
export var DatePicker = function (_a) {
    var value = _a.value, onChangeDate = _a.onChangeDate, parseInput = _a.parseInput, formatDate = _a.formatDate, name = _a.name, disabled = _a.disabled, error = _a.error, className = _a.className;
    var stringToDate = useCallback(function (str) {
        if (!str) {
            return null;
        }
        return parseInput ? parseInput(str) : parseJpnDateString(str);
    }, [parseInput]);
    var dateToString = useCallback(function (_date) {
        if (formatDate) {
            return formatDate(_date);
        }
        if (!_date) {
            return '';
        }
        return dayjs(_date).format('YYYY/MM/DD');
    }, [formatDate]);
    var themes = useTheme();
    var _b = useState(stringToDate(value)), selectedDate = _b[0], setSelectedDate = _b[1];
    var inputRef = useRef(null);
    var inputWrapperRef = useRef(null);
    var calendarRef = useRef(null);
    var _c = useState({
        top: 0,
        left: 0,
    }), calendarPosition = _c[0], setCalendarPosition = _c[1];
    var _d = useState(false), isInputFocused = _d[0], setIsInputFocused = _d[1];
    var _e = useState(false), isCalendarShown = _e[0], setIsCalendarShown = _e[1];
    var updateDate = useCallback(function (newDate) {
        if (newDate === selectedDate ||
            (newDate && selectedDate && newDate.getTime() === selectedDate.getTime())) {
            // Do not update date if the new date is same with the old one.
            return;
        }
        if (!inputRef.current) {
            return;
        }
        // Do not change input value if new date is invalid date
        if (!newDate || dayjs(newDate).isValid()) {
            inputRef.current.value = dateToString(newDate);
        }
        setSelectedDate(newDate);
        onChangeDate && onChangeDate(newDate, inputRef.current.value);
    }, [selectedDate, dateToString, onChangeDate]);
    var switchCalendarVisibility = useCallback(function (isVisible) {
        if (!isVisible) {
            setIsCalendarShown(false);
            return;
        }
        if (!inputWrapperRef.current) {
            return;
        }
        setIsCalendarShown(true);
        var rect = inputWrapperRef.current.getBoundingClientRect();
        setCalendarPosition({
            top: rect.top + rect.height - 4 + window.pageYOffset,
            left: rect.left + window.pageXOffset,
        });
    }, []);
    useEffect(function () {
        if (value === undefined || !inputRef.current) {
            return;
        }
        /**
         * Do not format the given value in the following cases
         * - while input element is focused.
         * - if the given value is not date formattable.
         */
        if (!isInputFocused) {
            var newDate = stringToDate(value);
            if (newDate && dayjs(newDate).isValid()) {
                inputRef.current.value = dateToString(newDate);
                setSelectedDate(newDate);
                return;
            }
            setSelectedDate(null);
        }
        inputRef.current.value = value || '';
    }, [value, isInputFocused, dateToString, stringToDate]);
    useOuterClick([inputWrapperRef.current, calendarRef.current], useCallback(function () {
        switchCalendarVisibility(false);
    }, [switchCalendarVisibility]));
    var handleKeyDown = useCallback(function (e) {
        if (e.key !== 'Tab' || !inputRef.current || !calendarRef.current) {
            return;
        }
        var calendarButtons = calendarRef.current.querySelectorAll('button');
        if (calendarButtons.length === 0) {
            return;
        }
        var firstCalendarButton = calendarButtons[0];
        var lastCalendarButton = calendarButtons[calendarButtons.length - 1];
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
        var currentFocused = Array.from(calendarButtons).find(function (button) { return button === e.target; });
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
    return (React.createElement(Container, { className: className, onClick: function () {
            if (!disabled && !isCalendarShown) {
                switchCalendarVisibility(true);
            }
        }, onKeyDown: function (e) {
            if ((e.key === 'Escape' || e.key === 'Esc') && isCalendarShown) {
                e.stopPropagation();
                requestAnimationFrame(function () {
                    // delay hiding calendar because calendar will be displayed when input is focused
                    switchCalendarVisibility(false);
                });
                inputRef.current && inputRef.current.focus();
            }
        } },
        React.createElement(InputWrapper, { ref: inputWrapperRef },
            React.createElement(StyledInput, { type: "text", name: name, onChange: function () {
                    if (isCalendarShown) {
                        switchCalendarVisibility(false);
                    }
                }, onKeyPress: function (e) {
                    if (e.key === 'Enter') {
                        switchCalendarVisibility(!isCalendarShown);
                    }
                }, onFocus: function () {
                    setIsInputFocused(true);
                    switchCalendarVisibility(true);
                }, onBlur: function (e) {
                    setIsInputFocused(false);
                    var inputString = e.target.value;
                    if (inputString === '') {
                        updateDate(null);
                        return;
                    }
                    var newDate = parseInput ? parseInput(inputString) : parseJpnDateString(inputString);
                    updateDate(newDate);
                }, suffix: React.createElement(CalendarIconLayout, { themes: themes },
                    React.createElement(CalendarIconWrapper, { themes: themes },
                        React.createElement(Icon, { name: "fa-calendar-alt", color: isInputFocused || isCalendarShown
                                ? themes.palette.TEXT_BLACK
                                : themes.palette.BORDER }))), disabled: disabled, error: error, ref: inputRef })),
        isCalendarShown && (React.createElement(Portal, __assign({}, calendarPosition),
            React.createElement(Calendar, { value: selectedDate || undefined, onSelectDate: function (_, selected) {
                    updateDate(selected);
                    requestAnimationFrame(function () {
                        // delay hiding calendar because calendar will be displayed when input is focused
                        switchCalendarVisibility(false);
                    });
                    inputRef.current && inputRef.current.focus();
                }, ref: calendarRef })))));
};
var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: inline-block;\n"], ["\n  display: inline-block;\n"])));
var InputWrapper = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject([""], [""])));
var StyledInput = styled(Input)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  width: 100%;\n"], ["\n  width: 100%;\n"])));
var CalendarIconLayout = styled.span(function (_a) {
    var themes = _a.themes;
    var size = themes.size;
    return css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    height: 100%;\n    padding: ", " 0;\n    box-sizing: border-box;\n  "], ["\n    height: 100%;\n    padding: ", " 0;\n    box-sizing: border-box;\n  "])), size.pxToRem(size.space.XXS));
});
var CalendarIconWrapper = styled.span(function (_a) {
    var themes = _a.themes;
    var palette = themes.palette, size = themes.size;
    return css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    box-sizing: border-box;\n    height: 100%;\n    padding-left: ", ";\n    border-left: 1px solid ", ";\n    font-size: ", ";\n  "], ["\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    box-sizing: border-box;\n    height: 100%;\n    padding-left: ", ";\n    border-left: 1px solid ", ";\n    font-size: ", ";\n  "])), size.pxToRem(size.space.XXS), palette.BORDER, size.pxToRem(size.font.TALL));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=DatePicker.js.map