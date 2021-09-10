import React, { HTMLAttributes, MouseEvent, VFC } from 'react'
import styled, { css } from 'styled-components'
import dayjs from 'dayjs'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'
import { daysInWeek, getMonthArray, isBetween } from './calendarHelper'
import { UnstyledButton } from '../Button'

type Props = {
  current: Date
  from: Date
  to: Date
  onSelectDate: (e: MouseEvent, date: Date) => void
  selected?: Date | null
}
type ElementProps = Omit<HTMLAttributes<HTMLTableElement>, keyof Props>

export const CalendarTable: VFC<Props & ElementProps> = ({
  current,
  from,
  to,
  onSelectDate,
  selected,
  ...props
}) => {
  const themes = useTheme()
  const classNames = useClassNames()
  const currentDay = dayjs(current)
  const selectedDay = selected ? dayjs(selected) : null

  const now = dayjs().startOf('date')
  const fromDay = dayjs(from)
  const toDay = dayjs(to)

  const array = getMonthArray(currentDay.toDate())
  return (
    <Table
      {...props}
      themes={themes}
      className={`${props.className} ${classNames.calendarTable.wrapper}`}
    >
      <thead>
        <tr>
          {daysInWeek.map((day, i) => (
            <th key={i} className={classNames.calendarTable.headCell}>
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {array.map((week, weekIndex) => {
          return (
            <tr key={weekIndex}>
              {week.map((date, dateIndex) => {
                const isOutRange =
                  !date ||
                  !isBetween(currentDay.date(date).toDate(), fromDay.toDate(), toDay.toDate())
                const isSelectedDate =
                  !!date && !!selectedDay && currentDay.date(date).isSame(selectedDay, 'date')
                return (
                  <td key={dateIndex} className={classNames.calendarTable.dataCell}>
                    {date && (
                      <CellButton
                        themes={themes}
                        disabled={isOutRange}
                        onClick={(e) =>
                          !isOutRange && onSelectDate(e, currentDay.date(date).toDate())
                        }
                        aria-pressed={isSelectedDate}
                        type="button"
                      >
                        <DateCell
                          themes={themes}
                          isToday={currentDay.date(date).isSame(now, 'date')}
                          isSelected={isSelectedDate}
                        >
                          {date}
                        </DateCell>
                      </CellButton>
                    )}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

const Table = styled.table<{ themes: Theme }>(({ themes }) => {
  const { color, fontSize } = themes
  return css`
    color: ${color.TEXT_BLACK};
    font-size: ${fontSize.M};
    border-spacing: 0;
    margin: 4px 8px 13px;

    th {
      height: 37px;
      padding: 0;
      vertical-align: middle;
      text-align: center;
      font-weight: normal;
      color: ${color.TEXT_GREY};
    }
    td {
      width: 43px;
      height: 35px;
      padding: 0;
      vertical-align: middle;
    }
  `
})
const DateCell = styled.span<{ themes: Theme; isToday?: boolean; isSelected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 27px;
  height: 27px;
  border-radius: 50%;
  line-height: 0;
  ${({ themes: { color }, isToday, isSelected }) => css`
    ${isToday &&
    css`
      border: solid 1px ${color.BORDER};
    `}

    ${isSelected &&
    css`
      background-color: ${color.MAIN} !important;
      color: ${color.TEXT_WHITE} !important;
    `}
  `}
`
const CellButton = styled(UnstyledButton)<{ themes: Theme }>(
  ({ themes }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    cursor: pointer;

    :disabled {
      color: ${themes.color.TEXT_DISABLED};
      cursor: not-allowed;
    }
    :not(:disabled) {
      &:hover {
        ${DateCell} {
          background-color: ${themes.color.BASE_GREY};
          color: ${themes.color.TEXT_BLACK};
        }
      }
    }
  `,
)
