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
exports.CalendarTable = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const Button_1 = require("../Button");
const calendarHelper_1 = require("./calendarHelper");
const useClassNames_1 = require("./useClassNames");
const CalendarTable = ({ current, from, to, onSelectDate, selected, ...props }) => {
    const themes = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)();
    const currentDay = (0, dayjs_1.default)(current);
    const selectedDay = selected ? (0, dayjs_1.default)(selected) : null;
    const now = (0, dayjs_1.default)().startOf('date');
    const fromDay = (0, dayjs_1.default)(from);
    const toDay = (0, dayjs_1.default)(to);
    const array = (0, calendarHelper_1.getMonthArray)(currentDay.toDate());
    return (react_1.default.createElement(Table, { ...props, themes: themes, className: `${props.className} ${classNames.calendarTable.wrapper}` },
        react_1.default.createElement("thead", null,
            react_1.default.createElement("tr", null, calendarHelper_1.daysInWeek.map((day, i) => (react_1.default.createElement("th", { key: i, className: classNames.calendarTable.headCell }, day))))),
        react_1.default.createElement("tbody", null, array.map((week, weekIndex) => {
            return (react_1.default.createElement("tr", { key: weekIndex }, week.map((date, dateIndex) => {
                const isOutRange = !date ||
                    !(0, calendarHelper_1.isBetween)(currentDay.date(date).toDate(), fromDay.toDate(), toDay.toDate());
                const isSelectedDate = !!date && !!selectedDay && currentDay.date(date).isSame(selectedDay, 'date');
                return (react_1.default.createElement("td", { key: dateIndex, className: classNames.calendarTable.dataCell }, date && (react_1.default.createElement(CellButton, { themes: themes, disabled: isOutRange, onClick: (e) => !isOutRange && onSelectDate(e, currentDay.date(date).toDate()), "aria-pressed": isSelectedDate, type: "button" },
                    react_1.default.createElement(DateCell, { themes: themes, isToday: currentDay.date(date).isSame(now, 'date'), isSelected: isSelectedDate }, date)))));
            })));
        }))));
};
exports.CalendarTable = CalendarTable;
const Table = styled_components_1.default.table(({ themes }) => {
    const { color, fontSize, spacingByChar } = themes;
    return (0, styled_components_1.css) `
    color: ${color.TEXT_BLACK};
    font-size: ${fontSize.M};
    border-spacing: 0;
    padding: ${spacingByChar(0.25)} ${spacingByChar(0.75)} ${spacingByChar(1)};

    th {
      padding: ${spacingByChar(0.5)} 0;
      vertical-align: middle;
      text-align: center;
      font-weight: normal;
      color: ${color.TEXT_GREY};
    }
    td {
      padding: 0;
      vertical-align: middle;
    }
  `;
});
const DateCell = styled_components_1.default.span `
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  box-sizing: border-box;
  border-radius: 50%;
  line-height: 0;
  ${({ themes: { border, color }, isToday, isSelected }) => (0, styled_components_1.css) `
    ${isToday &&
    (0, styled_components_1.css) `
      border: ${border.shorthand};

      @media (prefers-contrast: more) {
        & {
          border: ${border.highContrast};
        }
      }
    `}

    ${isSelected &&
    (0, styled_components_1.css) `
      background-color: ${color.MAIN} !important;
      color: ${color.TEXT_WHITE} !important;
    `}
  `}
`;
const CellButton = (0, styled_components_1.default)(Button_1.UnstyledButton)(({ themes: { color, spacingByChar } }) => (0, styled_components_1.css) `
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${spacingByChar(0.25)} ${spacingByChar(0.5)};
    cursor: pointer;

    :disabled {
      color: ${color.TEXT_DISABLED};
      cursor: not-allowed;
    }
    :not(:disabled) {
      &:hover {
        ${DateCell} {
          background-color: ${color.BASE_GREY};
          color: ${color.TEXT_BLACK};
        }
      }
    }
  `);
//# sourceMappingURL=CalendarTable.js.map