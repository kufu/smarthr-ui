import dayjs from 'dayjs';
import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { UnstyledButton } from '../Button';
import { daysInWeek, getMonthArray, isBetween } from './calendarHelper';
import { useClassNames } from './useClassNames';
export const CalendarTable = ({ current, from, to, onSelectDate, selected, ...props }) => {
    const themes = useTheme();
    const classNames = useClassNames();
    const currentDay = dayjs(current);
    const selectedDay = selected ? dayjs(selected) : null;
    const now = dayjs().startOf('date');
    const fromDay = dayjs(from);
    const toDay = dayjs(to);
    const array = getMonthArray(currentDay.toDate());
    return (React.createElement(Table, { ...props, themes: themes, className: `${props.className} ${classNames.calendarTable.wrapper}` },
        React.createElement("thead", null,
            React.createElement("tr", null, daysInWeek.map((day, i) => (React.createElement("th", { key: i, className: classNames.calendarTable.headCell }, day))))),
        React.createElement("tbody", null, array.map((week, weekIndex) => {
            return (React.createElement("tr", { key: weekIndex }, week.map((date, dateIndex) => {
                const isOutRange = !date ||
                    !isBetween(currentDay.date(date).toDate(), fromDay.toDate(), toDay.toDate());
                const isSelectedDate = !!date && !!selectedDay && currentDay.date(date).isSame(selectedDay, 'date');
                return (React.createElement("td", { key: dateIndex, className: classNames.calendarTable.dataCell }, date && (React.createElement(CellButton, { themes: themes, disabled: isOutRange, onClick: (e) => !isOutRange && onSelectDate(e, currentDay.date(date).toDate()), "aria-pressed": isSelectedDate, type: "button" },
                    React.createElement(DateCell, { themes: themes, isToday: currentDay.date(date).isSame(now, 'date'), isSelected: isSelectedDate }, date)))));
            })));
        }))));
};
const Table = styled.table(({ themes }) => {
    const { color, fontSize, spacingByChar } = themes;
    return css `
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
const DateCell = styled.span `
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  box-sizing: border-box;
  border-radius: 50%;
  line-height: 0;
  ${({ themes: { border, color }, isToday, isSelected }) => css `
    ${isToday &&
    css `
      border: ${border.shorthand};

      @media (prefers-contrast: more) {
        & {
          border: ${border.highContrast};
        }
      }
    `}

    ${isSelected &&
    css `
      background-color: ${color.MAIN} !important;
      color: ${color.TEXT_WHITE} !important;
    `}
  `}
`;
const CellButton = styled(UnstyledButton)(({ themes: { color, spacingByChar } }) => css `
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