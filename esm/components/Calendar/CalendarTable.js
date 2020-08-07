var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled, { css } from 'styled-components';
import dayjs from 'dayjs';
import { useTheme } from '../../hooks/useTheme';
import { daysInWeek, getMonthArray, isBetween } from './calendarHelper';
import { ResetButton } from './ResetButton';
export var CalendarTable = function (_a) {
    var current = _a.current, from = _a.from, to = _a.to, onSelectDate = _a.onSelectDate, selected = _a.selected;
    var themes = useTheme();
    var currentDay = dayjs(current);
    var selectedDay = selected ? dayjs(selected) : null;
    var now = dayjs();
    var fromDay = dayjs(from);
    var toDay = dayjs(to);
    var array = getMonthArray(currentDay.toDate());
    return (React.createElement(Table, { themes: themes },
        React.createElement("thead", null,
            React.createElement("tr", null, daysInWeek.map(function (day, i) { return (React.createElement("th", { key: i }, day)); }))),
        React.createElement("tbody", null, array.map(function (week, weekIndex) {
            return (React.createElement("tr", { key: weekIndex }, week.map(function (date, dateIndex) {
                var isOutRange = !date ||
                    !isBetween(currentDay.date(date).toDate(), fromDay.toDate(), toDay.toDate());
                var isSelectedDate = !!date && !!selectedDay && currentDay.date(date).isSame(selectedDay, 'date');
                return (React.createElement("td", { key: dateIndex }, date && (React.createElement(CellButton, { themes: themes, disabled: isOutRange, onClick: function (e) {
                        return !isOutRange && onSelectDate(e, currentDay.date(date).toDate());
                    }, "aria-pressed": isSelectedDate },
                    React.createElement(DateCell, { themes: themes, isToday: currentDay.date(date).isSame(now, 'date'), isSelected: isSelectedDate }, date)))));
            })));
        }))));
};
var Table = styled.table(function (_a) {
    var themes = _a.themes;
    var palette = themes.palette, size = themes.size;
    return css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    color: ", ";\n    font-size: ", ";\n    border-spacing: 0;\n    padding: 4px 8px 13px;\n\n    th {\n      height: 37px;\n      padding: 0;\n      text-align: center;\n      font-weight: normal;\n      color: ", ";\n    }\n    td {\n      width: 43px;\n      height: 35px;\n      padding: 0;\n    }\n  "], ["\n    color: ", ";\n    font-size: ", ";\n    border-spacing: 0;\n    padding: 4px 8px 13px;\n\n    th {\n      height: 37px;\n      padding: 0;\n      text-align: center;\n      font-weight: normal;\n      color: ", ";\n    }\n    td {\n      width: 43px;\n      height: 35px;\n      padding: 0;\n    }\n  "])), palette.TEXT_BLACK, size.pxToRem(size.font.TALL), palette.TEXT_GREY);
});
var DateCell = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 27px;\n  height: 27px;\n  border-radius: 50%;\n  line-height: 0;\n  ", "\n"], ["\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 27px;\n  height: 27px;\n  border-radius: 50%;\n  line-height: 0;\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes, isToday = _a.isToday, isSelected = _a.isSelected;
    return css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    ", "\n\n    ", "\n  "], ["\n    ",
        "\n\n    ",
        "\n  "])), isToday && css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      border: solid 1px ", ";\n    "], ["\n      border: solid 1px ", ";\n    "])), themes.palette.BORDER), isSelected && css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      background-color: ", " !important;\n      color: #fff !important;\n    "], ["\n      background-color: ", " !important;\n      color: #fff !important;\n    "])), themes.palette.MAIN));
});
var CellButton = styled(ResetButton)(function (_a) {
    var themes = _a.themes;
    return css(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    width: 100%;\n    height: 100%;\n    cursor: pointer;\n\n    :disabled {\n      color: ", ";\n      cursor: not-allowed;\n    }\n    :not(:disabled) {\n      &:hover {\n        ", " {\n          background-color: #f5f5f5;\n          color: ", ";\n        }\n      }\n    }\n  "], ["\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    width: 100%;\n    height: 100%;\n    cursor: pointer;\n\n    :disabled {\n      color: ", ";\n      cursor: not-allowed;\n    }\n    :not(:disabled) {\n      &:hover {\n        ", " {\n          background-color: #f5f5f5;\n          color: ", ";\n        }\n      }\n    }\n  "])), themes.palette.TEXT_DISABLED, DateCell, themes.palette.TEXT_BLACK);
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=CalendarTable.js.map