var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React, { forwardRef, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import dayjs from 'dayjs';
import { useTheme } from '../../hooks/useTheme';
import { SecondaryButton } from '../Button';
import { Icon } from '../Icon';
import { CalendarTable } from './CalendarTable';
import { YearPicker } from './YearPicker';
import { getFromDate, getToDate, isBetween } from './calendarHelper';
export var Calendar = forwardRef(function (_a, ref) {
    var from = _a.from, to = _a.to, onSelectDate = _a.onSelectDate, value = _a.value;
    var themes = useTheme();
    var now = dayjs().startOf('date');
    var fromDay = dayjs(getFromDate(from));
    var toDay = dayjs(getToDate(to));
    var isValidValue = value && isBetween(value, fromDay.toDate(), toDay.toDate());
    var _b = useState(isValidValue ? dayjs(value) : now), currentMonth = _b[0], setCurrentMonth = _b[1];
    var _c = useState(false), isSelectingYear = _c[0], setIsSelectingYear = _c[1];
    useEffect(function () {
        if (value && isValidValue) {
            setCurrentMonth(dayjs(value));
        }
    }, [value, isValidValue]);
    var prevMonth = currentMonth.subtract(1, 'month');
    var nextMonth = currentMonth.add(1, 'month');
    return (React.createElement(Container, { themes: themes, ref: ref },
        React.createElement(Header, { themes: themes },
            React.createElement(YearMonth, null,
                currentMonth.year(),
                "\u5E74",
                currentMonth.month() + 1,
                "\u6708"),
            React.createElement(SecondaryButton, { onClick: function () { return setIsSelectingYear(!isSelectingYear); }, size: "s", square: true },
                React.createElement(Icon, { size: 13, name: isSelectingYear ? 'fa-caret-up' : 'fa-caret-down' })),
            React.createElement(MonthButtonLayout, null,
                React.createElement(SecondaryButton, { disabled: isSelectingYear || prevMonth.isBefore(fromDay, 'month'), onClick: function () { return setCurrentMonth(prevMonth); }, size: "s", square: true },
                    React.createElement(Icon, { size: 13, name: "fa-chevron-left" })),
                React.createElement(SecondaryButton, { disabled: isSelectingYear || nextMonth.isAfter(toDay, 'month'), onClick: function () { return setCurrentMonth(nextMonth); }, size: "s", square: true },
                    React.createElement(Icon, { size: 13, name: "fa-chevron-right" })))),
        React.createElement(TableLayout, null,
            isSelectingYear && (React.createElement(YearOverlay, null,
                React.createElement(YearPicker, { fromYear: fromDay.year(), toYear: toDay.year(), selectedYear: value === null || value === void 0 ? void 0 : value.getFullYear(), onSelectYear: function (year) {
                        setCurrentMonth(currentMonth.year(year));
                        requestAnimationFrame(function () {
                            // fallback for IE
                            // delay hiding elements to be able to follow parent elements of click event by ParentNode API
                            setIsSelectingYear(false);
                        });
                    } }))),
            React.createElement(CalendarTable, { current: currentMonth.toDate(), from: fromDay.toDate(), to: toDay.toDate(), onSelectDate: onSelectDate, selected: isValidValue ? value : null }))));
});
var Container = styled.section(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: inline-block;\n  border-radius: 6px;\n  background-color: #fff;\n  box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.3);\n  color: ", ";\n  overflow: hidden;\n"], ["\n  display: inline-block;\n  border-radius: 6px;\n  background-color: #fff;\n  box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.3);\n  color: ", ";\n  overflow: hidden;\n"])), function (props) { return props.themes.palette.TEXT_BLACK; });
var YearMonth = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-right: 8px;\n  font-weight: bold;\n"], ["\n  margin-right: 8px;\n  font-weight: bold;\n"])));
var Header = styled.header(function (_a) {
    var themes = _a.themes;
    var palette = themes.palette, size = themes.size;
    return css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    display: flex;\n    align-items: center;\n    padding: 16px;\n    border-bottom: solid 1px ", ";\n    ", " {\n      font-size: ", ";\n    }\n  "], ["\n    display: flex;\n    align-items: center;\n    padding: 16px;\n    border-bottom: solid 1px ", ";\n    ", " {\n      font-size: ", ";\n    }\n  "])), palette.BORDER, YearMonth, size.pxToRem(size.font.TALL));
});
var MonthButtonLayout = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: flex;\n  margin-left: auto;\n  & > *:not(:first-child) {\n    margin-left: 8px;\n  }\n"], ["\n  display: flex;\n  margin-left: auto;\n  & > *:not(:first-child) {\n    margin-left: 8px;\n  }\n"])));
var TableLayout = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  position: relative;\n"], ["\n  position: relative;\n"])));
var YearOverlay = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  z-index: 1;\n  background-color: #fff;\n"], ["\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  z-index: 1;\n  background-color: #fff;\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=Calendar.js.map