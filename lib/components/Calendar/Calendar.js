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
exports.Calendar = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useId_1 = require("../../hooks/useId");
const useTheme_1 = require("../../hooks/useTheme");
const Button_1 = require("../Button");
const Icon_1 = require("../Icon");
const CalendarTable_1 = require("./CalendarTable");
const YearPicker_1 = require("./YearPicker");
const calendarHelper_1 = require("./calendarHelper");
const useClassNames_1 = require("./useClassNames");
exports.Calendar = (0, react_1.forwardRef)(({ from = calendarHelper_1.minDate, to, onSelectDate, value, ...props }, ref) => {
    const themes = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)();
    const fromDate = (0, dayjs_1.default)((0, calendarHelper_1.getFromDate)(from));
    const toDate = (0, dayjs_1.default)((0, calendarHelper_1.getToDate)(to));
    const today = (0, dayjs_1.default)();
    const currentDay = toDate.isBefore(today) ? toDate : fromDate.isAfter(today) ? fromDate : today;
    const isValidValue = value && (0, calendarHelper_1.isBetween)(value, fromDate.toDate(), toDate.toDate());
    const [currentMonth, setCurrentMonth] = (0, react_1.useState)(isValidValue ? (0, dayjs_1.default)(value) : currentDay);
    const [isSelectingYear, setIsSelectingYear] = (0, react_1.useState)(false);
    const yearPickerId = (0, useId_1.useId)();
    (0, react_1.useEffect)(() => {
        if (value && isValidValue) {
            setCurrentMonth((0, dayjs_1.default)(value));
        }
    }, [value, isValidValue]);
    const prevMonth = currentMonth.subtract(1, 'month');
    const nextMonth = currentMonth.add(1, 'month');
    return (react_1.default.createElement(Container, { ...props, themes: themes, ref: ref, className: `${props.className} ${classNames.calendar.wrapper}` },
        react_1.default.createElement(Header, { themes: themes, className: classNames.calendar.header },
            react_1.default.createElement(YearMonth, { className: classNames.calendar.yearMonth },
                currentMonth.year(),
                "\u5E74",
                currentMonth.month() + 1,
                "\u6708"),
            react_1.default.createElement(Button_1.Button, { onClick: (e) => {
                    e.stopPropagation();
                    setIsSelectingYear(!isSelectingYear);
                }, size: "s", square: true, "aria-expanded": isSelectingYear, "aria-controls": yearPickerId, className: classNames.calendar.selectingYear }, isSelectingYear ? (react_1.default.createElement(Icon_1.FaCaretUpIcon, { alt: "\u5E74\u3092\u9078\u629E\u3059\u308B" })) : (react_1.default.createElement(Icon_1.FaCaretDownIcon, { alt: "\u5E74\u3092\u9078\u629E\u3059\u308B" }))),
            react_1.default.createElement(MonthButtons, { className: classNames.calendar.monthButtons },
                react_1.default.createElement(Button_1.Button, { disabled: isSelectingYear || prevMonth.isBefore(fromDate, 'month'), onClick: () => setCurrentMonth(prevMonth), size: "s", square: true, className: classNames.calendar.monthButtonPrev },
                    react_1.default.createElement(Icon_1.FaChevronLeftIcon, { alt: "\u524D\u306E\u6708\u3078" })),
                react_1.default.createElement(Button_1.Button, { disabled: isSelectingYear || nextMonth.isAfter(toDate, 'month'), onClick: () => setCurrentMonth(nextMonth), size: "s", square: true, className: classNames.calendar.monthButtonNext },
                    react_1.default.createElement(Icon_1.FaChevronRightIcon, { alt: "\u6B21\u306E\u6708\u3078" })))),
        react_1.default.createElement(TableLayout, null,
            react_1.default.createElement(YearPicker_1.YearPicker, { fromYear: fromDate.year(), toYear: toDate.year(), selectedYear: value?.getFullYear(), onSelectYear: (year) => {
                    setCurrentMonth(currentMonth.year(year));
                    setIsSelectingYear(false);
                }, isDisplayed: isSelectingYear, id: yearPickerId }),
            react_1.default.createElement(CalendarTable_1.CalendarTable, { current: currentMonth.toDate(), from: fromDate.toDate(), to: toDate.toDate(), onSelectDate: onSelectDate, selected: isValidValue ? value : null }))));
});
const Container = styled_components_1.default.section `
  ${({ themes: { color, shadow } }) => (0, styled_components_1.css) `
    display: inline-block;
    border-radius: 6px;
    background-color: ${color.WHITE};
    box-shadow: ${shadow.LAYER3};
    color: ${color.TEXT_BLACK};
    overflow: hidden;
  `}
`;
const YearMonth = styled_components_1.default.div `
  margin-right: 8px;
  font-weight: bold;
`;
const Header = styled_components_1.default.header(({ themes }) => {
    const { color, fontSize } = themes;
    return (0, styled_components_1.css) `
    display: flex;
    align-items: center;
    padding: 16px;
    border-bottom: solid 1px ${color.BORDER};
    ${YearMonth} {
      font-size: ${fontSize.M};
    }
  `;
});
const MonthButtons = styled_components_1.default.div `
  display: flex;
  margin-left: auto;
  & > *:not(:first-child) {
    margin-left: 8px;
  }
`;
const TableLayout = styled_components_1.default.div `
  position: relative;
`;
//# sourceMappingURL=Calendar.js.map