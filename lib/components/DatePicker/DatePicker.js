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
exports.DatePicker = exports.DEFAULT_FROM = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useId_1 = require("../../hooks/useId");
const useOuterClick_1 = require("../../hooks/useOuterClick");
const useTheme_1 = require("../../hooks/useTheme");
const Calendar_1 = require("../Calendar");
const Icon_1 = require("../Icon");
const Input_1 = require("../Input");
const Portal_1 = require("./Portal");
const datePickerHelper_1 = require("./datePickerHelper");
const useClassNames_1 = require("./useClassNames");
const useGlobalKeyDown_1 = require("./useGlobalKeyDown");
exports.DEFAULT_FROM = new Date(1900, 0, 1);
exports.DatePicker = (0, react_1.forwardRef)(({ value, name, from = exports.DEFAULT_FROM, to, disabled, width, error, className = '', parseInput, formatDate, showAlternative, onChangeDate, ...inputAttrs }, ref) => {
    const stringToDate = (0, react_1.useCallback)((str) => {
        if (!str) {
            return null;
        }
        return parseInput ? parseInput(str) : (0, datePickerHelper_1.parseJpnDateString)(str);
    }, [parseInput]);
    const dateToString = (0, react_1.useCallback)((d) => {
        if (formatDate) {
            return formatDate(d);
        }
        if (!d) {
            return '';
        }
        return (0, dayjs_1.default)(d).format('YYYY/MM/DD');
    }, [formatDate]);
    const dateToAlternativeFormat = (0, react_1.useCallback)((d) => {
        if (!d || !showAlternative) {
            return null;
        }
        return showAlternative(d);
    }, [showAlternative]);
    const themes = (0, useTheme_1.useTheme)();
    const [selectedDate, setSelectedDate] = (0, react_1.useState)(stringToDate(value));
    const inputRef = (0, react_1.useRef)(null);
    const inputWrapperRef = (0, react_1.useRef)(null);
    const calendarPortalRef = (0, react_1.useRef)(null);
    const [inputRect, setInputRect] = (0, react_1.useState)(null);
    const [isInputFocused, setIsInputFocused] = (0, react_1.useState)(false);
    const [isCalendarShown, setIsCalendarShown] = (0, react_1.useState)(false);
    const [alternativeFormat, setAlternativeFormat] = (0, react_1.useState)(null);
    const calenderId = (0, useId_1.useId)();
    (0, react_1.useImperativeHandle)(ref, () => inputRef.current);
    const updateDate = (0, react_1.useCallback)((newDate) => {
        if (!inputRef.current ||
            newDate === selectedDate ||
            (newDate && selectedDate && newDate.getTime() === selectedDate.getTime())) {
            // Do not update date if the new date is same with the old one.
            return;
        }
        const isValid = !newDate || (0, dayjs_1.default)(newDate).isValid();
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
    const switchCalendarVisibility = (0, react_1.useCallback)((isVisible) => {
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
    (0, react_1.useEffect)(() => {
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
            if (newDate && (0, dayjs_1.default)(newDate).isValid()) {
                inputRef.current.value = dateToString(newDate);
                setAlternativeFormat(dateToAlternativeFormat(newDate));
                setSelectedDate(newDate);
                return;
            }
            setSelectedDate(null);
        }
        inputRef.current.value = value || '';
    }, [value, isInputFocused, dateToString, dateToAlternativeFormat, stringToDate]);
    (0, useOuterClick_1.useOuterClick)([inputWrapperRef, calendarPortalRef], (0, react_1.useCallback)(() => {
        switchCalendarVisibility(false);
    }, [switchCalendarVisibility]));
    const handleKeyDown = (0, react_1.useCallback)((e) => {
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
    (0, useGlobalKeyDown_1.useGlobalKeyDown)(handleKeyDown);
    const caretIconColor = (0, react_1.useMemo)(() => {
        if (isInputFocused || isCalendarShown)
            return themes.color.TEXT_BLACK;
        if (disabled)
            return themes.color.TEXT_DISABLED;
        return themes.color.TEXT_GREY;
    }, [isCalendarShown, isInputFocused, disabled, themes]);
    const classNames = (0, useClassNames_1.useClassNames)();
    return (react_1.default.createElement(Container, { "$width": width, className: `${className} ${classNames.wrapper}`, onClick: () => {
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
        react_1.default.createElement("div", { ref: inputWrapperRef },
            react_1.default.createElement(Input_1.Input, { ...inputAttrs, width: "100%", name: name, onChange: () => {
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
                }, suffix: react_1.default.createElement(InputSuffixLayout, { themes: themes },
                    react_1.default.createElement(InputSuffixWrapper, { themes: themes },
                        showAlternative && (react_1.default.createElement(InputSuffixText, { themes: themes }, alternativeFormat)),
                        react_1.default.createElement(Icon_1.FaCalendarAltIcon, { color: caretIconColor }))), disabled: disabled, error: error, ref: inputRef, className: classNames.inputContainer, "aria-expanded": isCalendarShown, "aria-controls": calenderId, "aria-haspopup": true })),
        isCalendarShown && inputRect && (react_1.default.createElement(Portal_1.Portal, { inputRect: inputRect, ref: calendarPortalRef },
            react_1.default.createElement(Calendar_1.Calendar, { id: calenderId, value: selectedDate || undefined, from: from, to: to, onSelectDate: (_, selected) => {
                    updateDate(selected);
                    requestAnimationFrame(() => {
                        // delay hiding calendar because calendar will be displayed when input is focused
                        switchCalendarVisibility(false);
                    });
                    inputRef.current && inputRef.current.focus();
                } })))));
});
const Container = styled_components_1.default.div `
  ${({ $width = 'auto' }) => (0, styled_components_1.css) `
    display: inline-block;
    width: ${typeof $width === 'number' ? `${$width}px` : $width};
  `}
`;
const InputSuffixLayout = styled_components_1.default.span(({ themes: { spacingByChar } }) => {
    return (0, styled_components_1.css) `
    height: 100%;
    padding: ${spacingByChar(0.5)} 0;
    box-sizing: border-box;
  `;
});
const InputSuffixWrapper = styled_components_1.default.span(({ themes }) => {
    const { fontSize, color, spacingByChar } = themes;
    return (0, styled_components_1.css) `
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
const InputSuffixText = styled_components_1.default.span(({ themes }) => {
    const { fontSize, color, spacingByChar } = themes;
    return (0, styled_components_1.css) `
    margin-right: ${spacingByChar(0.5)};
    color: ${color.TEXT_GREY};
    font-size: ${fontSize.S};
  `;
});
//# sourceMappingURL=DatePicker.js.map