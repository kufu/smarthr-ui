"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.DatePicker = void 0;
var react_1 = __importStar(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var dayjs_1 = __importDefault(require("dayjs"));
var useTheme_1 = require("../../hooks/useTheme");
var Input_1 = require("../Input");
var Icon_1 = require("../Icon");
var Calendar_1 = require("../Calendar");
var Portal_1 = require("./Portal");
var useOuterClick_1 = require("./useOuterClick");
var useGlobalKeyDown_1 = require("./useGlobalKeyDown");
var datePickerHelper_1 = require("./datePickerHelper");
exports.DatePicker = function (_a) {
    var value = _a.value, onChangeDate = _a.onChangeDate, parseInput = _a.parseInput, formatDate = _a.formatDate, name = _a.name, disabled = _a.disabled, error = _a.error, className = _a.className;
    var stringToDate = react_1.useCallback(function (str) {
        if (!str) {
            return null;
        }
        return parseInput ? parseInput(str) : datePickerHelper_1.parseJpnDateString(str);
    }, [parseInput]);
    var dateToString = react_1.useCallback(function (_date) {
        if (formatDate) {
            return formatDate(_date);
        }
        if (!_date) {
            return '';
        }
        return dayjs_1.default(_date).format('YYYY/MM/DD');
    }, [formatDate]);
    var themes = useTheme_1.useTheme();
    var _b = react_1.useState(stringToDate(value)), selectedDate = _b[0], setSelectedDate = _b[1];
    var inputRef = react_1.useRef(null);
    var inputWrapperRef = react_1.useRef(null);
    var calendarRef = react_1.useRef(null);
    var _c = react_1.useState({
        top: 0,
        left: 0,
    }), calendarPosition = _c[0], setCalendarPosition = _c[1];
    var _d = react_1.useState(false), isInputFocused = _d[0], setIsInputFocused = _d[1];
    var _e = react_1.useState(false), isCalendarShown = _e[0], setIsCalendarShown = _e[1];
    var updateDate = react_1.useCallback(function (newDate) {
        if (newDate === selectedDate ||
            (newDate && selectedDate && newDate.getTime() === selectedDate.getTime())) {
            // Do not update date if the new date is same with the old one.
            return;
        }
        if (!inputRef.current) {
            return;
        }
        // Do not change input value if new date is invalid date
        if (!newDate || dayjs_1.default(newDate).isValid()) {
            inputRef.current.value = dateToString(newDate);
        }
        setSelectedDate(newDate);
        onChangeDate && onChangeDate(newDate, inputRef.current.value);
    }, [selectedDate, dateToString, onChangeDate]);
    var switchCalendarVisibility = react_1.useCallback(function (isVisible) {
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
    react_1.useEffect(function () {
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
            if (newDate && dayjs_1.default(newDate).isValid()) {
                inputRef.current.value = dateToString(newDate);
                setSelectedDate(newDate);
                return;
            }
            setSelectedDate(null);
        }
        inputRef.current.value = value || '';
    }, [value, isInputFocused, dateToString, stringToDate]);
    useOuterClick_1.useOuterClick([inputWrapperRef.current, calendarRef.current], react_1.useCallback(function () {
        switchCalendarVisibility(false);
    }, [switchCalendarVisibility]));
    var handleKeyDown = react_1.useCallback(function (e) {
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
    useGlobalKeyDown_1.useGlobalKeyDown(handleKeyDown);
    return (react_1.default.createElement(Container, { className: className, onClick: function () {
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
        react_1.default.createElement(InputWrapper, { ref: inputWrapperRef },
            react_1.default.createElement(StyledInput, { type: "text", name: name, onChange: function () {
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
                    var newDate = parseInput ? parseInput(inputString) : datePickerHelper_1.parseJpnDateString(inputString);
                    updateDate(newDate);
                }, suffix: react_1.default.createElement(CalendarIconLayout, { themes: themes },
                    react_1.default.createElement(CalendarIconWrapper, { themes: themes },
                        react_1.default.createElement(Icon_1.Icon, { name: "fa-calendar-alt", color: isInputFocused || isCalendarShown
                                ? themes.palette.TEXT_BLACK
                                : themes.palette.BORDER }))), disabled: disabled, error: error, ref: inputRef })),
        isCalendarShown && (react_1.default.createElement(Portal_1.Portal, __assign({}, calendarPosition),
            react_1.default.createElement(Calendar_1.Calendar, { value: selectedDate || undefined, onSelectDate: function (_, selected) {
                    updateDate(selected);
                    requestAnimationFrame(function () {
                        // delay hiding calendar because calendar will be displayed when input is focused
                        switchCalendarVisibility(false);
                    });
                    inputRef.current && inputRef.current.focus();
                }, ref: calendarRef })))));
};
var Container = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: inline-block;\n"], ["\n  display: inline-block;\n"])));
var InputWrapper = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject([""], [""])));
var StyledInput = styled_components_1.default(Input_1.Input)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  width: 100%;\n"], ["\n  width: 100%;\n"])));
var CalendarIconLayout = styled_components_1.default.span(function (_a) {
    var themes = _a.themes;
    var size = themes.size;
    return styled_components_1.css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    height: 100%;\n    padding: ", " 0;\n    box-sizing: border-box;\n  "], ["\n    height: 100%;\n    padding: ", " 0;\n    box-sizing: border-box;\n  "])), size.pxToRem(size.space.XXS));
});
var CalendarIconWrapper = styled_components_1.default.span(function (_a) {
    var themes = _a.themes;
    var palette = themes.palette, size = themes.size;
    return styled_components_1.css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    box-sizing: border-box;\n    height: 100%;\n    padding-left: ", ";\n    border-left: 1px solid ", ";\n    font-size: ", ";\n  "], ["\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    box-sizing: border-box;\n    height: 100%;\n    padding-left: ", ";\n    border-left: 1px solid ", ";\n    font-size: ", ";\n  "])), size.pxToRem(size.space.XXS), palette.BORDER, size.pxToRem(size.font.TALL));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=DatePicker.js.map