import React, { FC, MouseEvent } from 'react'
import styled, { css } from 'styled-components'
import dayjs from 'dayjs'

import { Theme, useTheme } from '../../hooks/useTheme'
import { daysInWeek, getMonthArray, isBetween } from './calendarHelper'
import { ResetButton } from './ResetButton'

type Props = {
  current: Date
  from: Date
  to: Date
  onSelectDate: (e: MouseEvent, date: Date) => void
  selected?: Date | null
}

export const CalendarTable: FC<Props> = ({ current, from, to, onSelectDate, selected }) => {
  const themes = useTheme()
  const currentDay = dayjs(current)
  const selectedDay = selected ? dayjs(selected) : null

  const now = dayjs().startOf('date')
  const fromDay = dayjs(from)
  const toDay = dayjs(to)

  const array = getMonthArray(currentDay.toDate())
  return (
    <Table themes={themes}>
      <thead>
        <tr>
          {daysInWeek.map((day, i) => (
            <th key={i}>{day}</th>
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
                  <td key={dateIndex}>
                    {date && (
                      <CellButton
                        themes={themes}
                        disabled={isOutRange}
                        onClick={(e) =>
                          !isOutRange && onSelectDate(e, currentDay.date(date).toDate())
                        }
                        aria-pressed={isSelectedDate}
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
  const { palette, size } = themes
  return css`
    color: ${palette.TEXT_BLACK};
    font-size: ${size.pxToRem(size.font.TALL)};
    border-spacing: 0;
    margin: 4px 8px 13px;

    th {
      height: 37px;
      padding: 0;
      vertical-align: middle;
      text-align: center;
      font-weight: normal;
      color: ${palette.TEXT_GREY};
    }
    td {
      width: 43px;
      height: 35px;
      padding: 0;
      vertical-align: middle;
    }
  `
})
const DateCell = styled.div<{ themes: Theme; isToday?: boolean; isSelected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 27px;
  height: 27px;
  border-radius: 50%;
  line-height: 0;
  ${({ themes, isToday, isSelected }) => css`
    ${isToday &&
    css`
      border: solid 1px ${themes.palette.BORDER};
    `}

    ${isSelected &&
    css`
      background-color: ${themes.palette.MAIN} !important;
      color: #fff !important;
    `}
  `}
`
const CellButton = styled(ResetButton)<{ themes: Theme }>(
  ({ themes }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    cursor: pointer;

    :disabled {
      color: ${themes.palette.TEXT_DISABLED};
      cursor: not-allowed;
    }
    :not(:disabled) {
      &:hover {
        ${DateCell} {
          background-color: #f5f5f5;
          color: ${themes.palette.TEXT_BLACK};
        }
      }
    }
  `,
)
