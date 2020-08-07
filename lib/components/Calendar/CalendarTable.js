"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarTable = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var dayjs_1 = __importDefault(require("dayjs"));
var useTheme_1 = require("../../hooks/useTheme");
var calendarHelper_1 = require("./calendarHelper");
var ResetButton_1 = require("./ResetButton");
exports.CalendarTable = function (_a) {
    var current = _a.current, from = _a.from, to = _a.to, onSelectDate = _a.onSelectDate, selected = _a.selected;
    var themes = useTheme_1.useTheme();
    var currentDay = dayjs_1.default(current);
    var selectedDay = selected ? dayjs_1.default(selected) : null;
    var now = dayjs_1.default();
    var fromDay = dayjs_1.default(from);
    var toDay = dayjs_1.default(to);
    var array = calendarHelper_1.getMonthArray(currentDay.toDate());
    return (react_1.default.createElement(Table, { themes: themes },
        react_1.default.createElement("thead", null,
            react_1.default.createElement("tr", null, calendarHelper_1.daysInWeek.map(function (day, i) { return (react_1.default.createElement("th", { key: i }, day)); }))),
        react_1.default.createElement("tbody", null, array.map(function (week, weekIndex) {
            return (react_1.default.createElement("tr", { key: weekIndex }, week.map(function (date, dateIndex) {
                var isOutRange = !date ||
                    !calendarHelper_1.isBetween(currentDay.date(date).toDate(), fromDay.toDate(), toDay.toDate());
                var isSelectedDate = !!date && !!selectedDay && currentDay.date(date).isSame(selectedDay, 'date');
                return (react_1.default.createElement("td", { key: dateIndex }, date && (react_1.default.createElement(CellButton, { themes: themes, disabled: isOutRange, onClick: function (e) {
                        return !isOutRange && onSelectDate(e, currentDay.date(date).toDate());
                    }, "aria-pressed": isSelectedDate },
                    react_1.default.createElement(DateCell, { themes: themes, isToday: currentDay.date(date).isSame(now, 'date'), isSelected: isSelectedDate }, date)))));
            })));
        }))));
};
var Table = styled_components_1.default.table(function (_a) {
    var themes = _a.themes;
    var palette = themes.palette, size = themes.size;
    return styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    color: ", ";\n    font-size: ", ";\n    border-spacing: 0;\n    padding: 4px 8px 13px;\n\n    th {\n      height: 37px;\n      padding: 0;\n      text-align: center;\n      font-weight: normal;\n      color: ", ";\n    }\n    td {\n      width: 43px;\n      height: 35px;\n      padding: 0;\n    }\n  "], ["\n    color: ", ";\n    font-size: ", ";\n    border-spacing: 0;\n    padding: 4px 8px 13px;\n\n    th {\n      height: 37px;\n      padding: 0;\n      text-align: center;\n      font-weight: normal;\n      color: ", ";\n    }\n    td {\n      width: 43px;\n      height: 35px;\n      padding: 0;\n    }\n  "])), palette.TEXT_BLACK, size.pxToRem(size.font.TALL), palette.TEXT_GREY);
});
var DateCell = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 27px;\n  height: 27px;\n  border-radius: 50%;\n  line-height: 0;\n  ", "\n"], ["\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 27px;\n  height: 27px;\n  border-radius: 50%;\n  line-height: 0;\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes, isToday = _a.isToday, isSelected = _a.isSelected;
    return styled_components_1.css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    ", "\n\n    ", "\n  "], ["\n    ",
        "\n\n    ",
        "\n  "])), isToday && styled_components_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      border: solid 1px ", ";\n    "], ["\n      border: solid 1px ", ";\n    "])), themes.palette.BORDER), isSelected && styled_components_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      background-color: ", " !important;\n      color: #fff !important;\n    "], ["\n      background-color: ", " !important;\n      color: #fff !important;\n    "])), themes.palette.MAIN));
});
var CellButton = styled_components_1.default(ResetButton_1.ResetButton)(function (_a) {
    var themes = _a.themes;
    return styled_components_1.css(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    width: 100%;\n    height: 100%;\n    cursor: pointer;\n\n    :disabled {\n      color: ", ";\n      cursor: not-allowed;\n    }\n    :not(:disabled) {\n      &:hover {\n        ", " {\n          background-color: #f5f5f5;\n          color: ", ";\n        }\n      }\n    }\n  "], ["\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    width: 100%;\n    height: 100%;\n    cursor: pointer;\n\n    :disabled {\n      color: ", ";\n      cursor: not-allowed;\n    }\n    :not(:disabled) {\n      &:hover {\n        ", " {\n          background-color: #f5f5f5;\n          color: ", ";\n        }\n      }\n    }\n  "])), themes.palette.TEXT_DISABLED, DateCell, themes.palette.TEXT_BLACK);
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=CalendarTable.js.map