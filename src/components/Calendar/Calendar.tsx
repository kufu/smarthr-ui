import React, { FC, MouseEvent, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import dayjs from 'dayjs'

import { Theme, useTheme } from '../../hooks/useTheme'
import { SecondaryButton } from '../Button'
import { Icon } from '../Icon'
import { CalendarTable } from './CalendarTable'
import { YearPicker } from './YearPicker'
import { getFromDate, getToDate, isBetween } from './calendarHelper'

type Props = {
  from?: Date
  to?: Date
  onSelectDate: (e: MouseEvent, date: Date) => void
  value?: Date
}

export const Calendar: FC<Props> = ({ from, to, onSelectDate, value }) => {
  const themes = useTheme()
  const now = dayjs()
  const fromDay = dayjs(getFromDate(from))
  const toDay = dayjs(getToDate(to))
  const isValidValue = value && isBetween(value, fromDay.toDate(), toDay.toDate())

  const [currentMonth, setCurrentMonth] = useState(isValidValue ? dayjs(value) : now)
  const [isSelectingYear, setIsSelectingYear] = useState(false)

  useEffect(() => {
    if (value && isValidValue) {
      setCurrentMonth(dayjs(value))
    }
  }, [value, isValidValue])

  const prevMonth = currentMonth.subtract(1, 'month')
  const nextMonth = currentMonth.add(1, 'month')

  return (
    <Container themes={themes}>
      <Header themes={themes}>
        <YearMonth>
          {currentMonth.year()}年{currentMonth.month() + 1}月
        </YearMonth>
        <SecondaryButton onClick={() => setIsSelectingYear(!isSelectingYear)} size="s" square>
          <Icon size={13} name={isSelectingYear ? 'fa-caret-up' : 'fa-caret-down'} />
        </SecondaryButton>
        <MonthButtonLayout>
          <SecondaryButton
            disabled={isSelectingYear || prevMonth.isBefore(fromDay, 'month')}
            onClick={() => setCurrentMonth(prevMonth)}
            size="s"
            square
          >
            <Icon size={13} name="fa-chevron-left" />
          </SecondaryButton>
          <SecondaryButton
            disabled={isSelectingYear || nextMonth.isAfter(toDay, 'month')}
            onClick={() => setCurrentMonth(nextMonth)}
            size="s"
            square
          >
            <Icon size={13} name="fa-chevron-right" />
          </SecondaryButton>
        </MonthButtonLayout>
      </Header>
      <TableLayout>
        {isSelectingYear && (
          <YearOverlay>
            <YearPicker
              fromYear={fromDay.year()}
              toYear={toDay.year()}
              selectedYear={value?.getFullYear()}
              onSelectYear={(year) => {
                setCurrentMonth(currentMonth.year(year))
                setIsSelectingYear(false)
              }}
            />
          </YearOverlay>
        )}
        <CalendarTable
          current={currentMonth.toDate()}
          from={fromDay.toDate()}
          to={toDay.toDate()}
          onSelectDate={onSelectDate}
          selected={isValidValue ? value : null}
        />
      </TableLayout>
    </Container>
  )
}

const Container = styled.section<{ themes: Theme }>`
  display: inline-block;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 4px 10px 0 rgba(51, 51, 51, 0.3);
  color: ${(props) => props.themes.palette.TEXT_BLACK};
  overflow: hidden;
`
const YearMonth = styled.div`
  margin-right: 8px;
  font-weight: bold;
`
const Header = styled.header<{ themes: Theme }>(({ themes }) => {
  const { palette, size } = themes
  return css`
    display: flex;
    align-items: center;
    padding: 16px;
    border-bottom: solid 1px ${palette.BORDER};
    ${YearMonth} {
      font-size: ${size.pxToRem(size.font.TALL)};
    }
  `
})
const MonthButtonLayout = styled.div`
  display: flex;
  margin-left: auto;
  & > *:not(:first-child) {
    margin-left: 8px;
  }
`
const TableLayout = styled.div`
  position: relative;
`
const YearOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  background-color: #fff;
`
