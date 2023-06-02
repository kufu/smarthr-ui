import dayjs from 'dayjs';
import React, { forwardRef, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { useId } from '../../hooks/useId';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../Button';
import { FaCaretDownIcon, FaCaretUpIcon, FaChevronLeftIcon, FaChevronRightIcon } from '../Icon';
import { CalendarTable } from './CalendarTable';
import { YearPicker } from './YearPicker';
import { getFromDate, getToDate, isBetween, minDate } from './calendarHelper';
import { useClassNames } from './useClassNames';
export const Calendar = forwardRef(({ from = minDate, to, onSelectDate, value, ...props }, ref) => {
    const themes = useTheme();
    const classNames = useClassNames();
    const fromDate = dayjs(getFromDate(from));
    const toDate = dayjs(getToDate(to));
    const today = dayjs();
    const currentDay = toDate.isBefore(today) ? toDate : fromDate.isAfter(today) ? fromDate : today;
    const isValidValue = value && isBetween(value, fromDate.toDate(), toDate.toDate());
    const [currentMonth, setCurrentMonth] = useState(isValidValue ? dayjs(value) : currentDay);
    const [isSelectingYear, setIsSelectingYear] = useState(false);
    const yearPickerId = useId();
    useEffect(() => {
        if (value && isValidValue) {
            setCurrentMonth(dayjs(value));
        }
    }, [value, isValidValue]);
    const prevMonth = currentMonth.subtract(1, 'month');
    const nextMonth = currentMonth.add(1, 'month');
    return (React.createElement(Container, { ...props, themes: themes, ref: ref, className: `${props.className} ${classNames.calendar.wrapper}` },
        React.createElement(Header, { themes: themes, className: classNames.calendar.header },
            React.createElement(YearMonth, { className: classNames.calendar.yearMonth },
                currentMonth.year(),
                "\u5E74",
                currentMonth.month() + 1,
                "\u6708"),
            React.createElement(Button, { onClick: (e) => {
                    e.stopPropagation();
                    setIsSelectingYear(!isSelectingYear);
                }, size: "s", square: true, "aria-expanded": isSelectingYear, "aria-controls": yearPickerId, className: classNames.calendar.selectingYear }, isSelectingYear ? (React.createElement(FaCaretUpIcon, { alt: "\u5E74\u3092\u9078\u629E\u3059\u308B" })) : (React.createElement(FaCaretDownIcon, { alt: "\u5E74\u3092\u9078\u629E\u3059\u308B" }))),
            React.createElement(MonthButtons, { className: classNames.calendar.monthButtons },
                React.createElement(Button, { disabled: isSelectingYear || prevMonth.isBefore(fromDate, 'month'), onClick: () => setCurrentMonth(prevMonth), size: "s", square: true, className: classNames.calendar.monthButtonPrev },
                    React.createElement(FaChevronLeftIcon, { alt: "\u524D\u306E\u6708\u3078" })),
                React.createElement(Button, { disabled: isSelectingYear || nextMonth.isAfter(toDate, 'month'), onClick: () => setCurrentMonth(nextMonth), size: "s", square: true, className: classNames.calendar.monthButtonNext },
                    React.createElement(FaChevronRightIcon, { alt: "\u6B21\u306E\u6708\u3078" })))),
        React.createElement(TableLayout, null,
            React.createElement(YearPicker, { fromYear: fromDate.year(), toYear: toDate.year(), selectedYear: value?.getFullYear(), onSelectYear: (year) => {
                    setCurrentMonth(currentMonth.year(year));
                    setIsSelectingYear(false);
                }, isDisplayed: isSelectingYear, id: yearPickerId }),
            React.createElement(CalendarTable, { current: currentMonth.toDate(), from: fromDate.toDate(), to: toDate.toDate(), onSelectDate: onSelectDate, selected: isValidValue ? value : null }))));
});
const Container = styled.section `
  ${({ themes: { color, shadow } }) => css `
    display: inline-block;
    border-radius: 6px;
    background-color: ${color.WHITE};
    box-shadow: ${shadow.LAYER3};
    color: ${color.TEXT_BLACK};
    overflow: hidden;
  `}
`;
const YearMonth = styled.div `
  margin-right: 8px;
  font-weight: bold;
`;
const Header = styled.header(({ themes }) => {
    const { color, fontSize } = themes;
    return css `
    display: flex;
    align-items: center;
    padding: 16px;
    border-bottom: solid 1px ${color.BORDER};
    ${YearMonth} {
      font-size: ${fontSize.M};
    }
  `;
});
const MonthButtons = styled.div `
  display: flex;
  margin-left: auto;
  & > *:not(:first-child) {
    margin-left: 8px;
  }
`;
const TableLayout = styled.div `
  position: relative;
`;
//# sourceMappingURL=Calendar.js.map