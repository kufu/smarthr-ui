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
exports.Calendar = void 0;
var react_1 = __importStar(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var dayjs_1 = __importDefault(require("dayjs"));
var useTheme_1 = require("../../hooks/useTheme");
var Button_1 = require("../Button");
var Icon_1 = require("../Icon");
var CalendarTable_1 = require("./CalendarTable");
var YearPicker_1 = require("./YearPicker");
var calendarHelper_1 = require("./calendarHelper");
exports.Calendar = function (_a) {
    var from = _a.from, to = _a.to, onSelectDate = _a.onSelectDate, value = _a.value;
    var themes = useTheme_1.useTheme();
    var now = dayjs_1.default();
    var fromDay = dayjs_1.default(calendarHelper_1.getFromDate(from));
    var toDay = dayjs_1.default(calendarHelper_1.getToDate(to));
    var isValidValue = value && calendarHelper_1.isBetween(value, fromDay.toDate(), toDay.toDate());
    var _b = react_1.useState(isValidValue ? dayjs_1.default(value) : now), currentMonth = _b[0], setCurrentMonth = _b[1];
    var _c = react_1.useState(false), isSelectingYear = _c[0], setIsSelectingYear = _c[1];
    var prevMonth = currentMonth.subtract(1, 'month');
    var nextMonth = currentMonth.add(1, 'month');
    return (react_1.default.createElement(Container, { themes: themes },
        react_1.default.createElement(Header, { themes: themes },
            react_1.default.createElement(YearMonth, null,
                currentMonth.year(),
                "\u5E74",
                currentMonth.month() + 1,
                "\u6708"),
            react_1.default.createElement(Button_1.SecondaryButton, { onClick: function () { return setIsSelectingYear(!isSelectingYear); }, size: "s", square: true },
                react_1.default.createElement(Icon_1.Icon, { size: 13, name: isSelectingYear ? 'fa-caret-up' : 'fa-caret-down' })),
            react_1.default.createElement(MonthButtonLayout, null,
                react_1.default.createElement(Button_1.SecondaryButton, { disabled: isSelectingYear || prevMonth.isBefore(fromDay, 'month'), onClick: function () { return setCurrentMonth(prevMonth); }, size: "s", square: true },
                    react_1.default.createElement(Icon_1.Icon, { size: 13, name: "fa-chevron-left" })),
                react_1.default.createElement(Button_1.SecondaryButton, { disabled: isSelectingYear || nextMonth.isAfter(toDay, 'month'), onClick: function () { return setCurrentMonth(nextMonth); }, size: "s", square: true },
                    react_1.default.createElement(Icon_1.Icon, { size: 13, name: "fa-chevron-right" })))),
        react_1.default.createElement(TableLayout, null,
            isSelectingYear && (react_1.default.createElement(YearOverlay, null,
                react_1.default.createElement(YearPicker_1.YearPicker, { fromYear: fromDay.year(), toYear: toDay.year(), selectedYear: value === null || value === void 0 ? void 0 : value.getFullYear(), onSelectYear: function (year) {
                        setCurrentMonth(currentMonth.year(year));
                        setIsSelectingYear(false);
                    } }))),
            react_1.default.createElement(CalendarTable_1.CalendarTable, { current: currentMonth.toDate(), from: fromDay.toDate(), to: toDay.toDate(), onSelectDate: onSelectDate, selected: isValidValue ? value : null }))));
};
var Container = styled_components_1.default.section(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: inline-block;\n  border-radius: 6px;\n  background-color: #fff;\n  box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.3);\n  color: ", ";\n  overflow: hidden;\n"], ["\n  display: inline-block;\n  border-radius: 6px;\n  background-color: #fff;\n  box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.3);\n  color: ", ";\n  overflow: hidden;\n"])), function (props) { return props.themes.palette.TEXT_BLACK; });
var YearMonth = styled_components_1.default.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-right: 8px;\n  font-weight: bold;\n"], ["\n  margin-right: 8px;\n  font-weight: bold;\n"])));
var Header = styled_components_1.default.header(function (_a) {
    var themes = _a.themes;
    var palette = themes.palette, size = themes.size;
    return styled_components_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    display: flex;\n    align-items: center;\n    padding: 16px;\n    border-bottom: solid 1px ", ";\n    ", " {\n      font-size: ", ";\n    }\n  "], ["\n    display: flex;\n    align-items: center;\n    padding: 16px;\n    border-bottom: solid 1px ", ";\n    ", " {\n      font-size: ", ";\n    }\n  "])), palette.BORDER, YearMonth, size.pxToRem(size.font.TALL));
});
var MonthButtonLayout = styled_components_1.default.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: flex;\n  margin-left: auto;\n  & > *:not(:first-child) {\n    margin-left: 8px;\n  }\n"], ["\n  display: flex;\n  margin-left: auto;\n  & > *:not(:first-child) {\n    margin-left: 8px;\n  }\n"])));
var TableLayout = styled_components_1.default.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  position: relative;\n"], ["\n  position: relative;\n"])));
var YearOverlay = styled_components_1.default.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  z-index: 1;\n  background-color: #fff;\n"], ["\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  z-index: 1;\n  background-color: #fff;\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=Calendar.js.map