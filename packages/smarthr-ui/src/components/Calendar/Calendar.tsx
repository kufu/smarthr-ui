'use client'

import dayjs from 'dayjs'
import React, {
  ComponentProps,
  MouseEvent,
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { Button } from '../Button'
import { FaCaretDownIcon, FaCaretUpIcon, FaChevronLeftIcon, FaChevronRightIcon } from '../Icon'
import { Cluster } from '../Layout'
import { Section } from '../SectioningContent'

import { CalendarTable } from './CalendarTable'
import { YearPicker } from './YearPicker'
import { getFromDate, getToDate, isBetween, minDate } from './calendarHelper'

type Props = {
  /** 選択可能な開始日 */
  from?: Date
  /** 選択可能な終了日 */
  to?: Date
  /** トリガのセレクトイベントを処理するハンドラ */
  onSelectDate: (e: MouseEvent, date: Date) => void
  /** 選択された日付 */
  value?: Date
}
type ElementProps = Omit<ComponentProps<'section'>, keyof Props>

const calendar = tv({
  slots: {
    container:
      'smarthr-ui-Calendar shr-inline-block shr-overflow-hidden shr-rounded-m shr-bg-white shr-text-black shr-shadow-layer-3 forced-colors:shr-border-shorthand forced-colors:shr-shadow-none',
    header: 'smarthr-ui-Calendar-header shr-border-b-shorthand shr-flex shr-items-center shr-p-1',
    yearMonth: 'smarthr-ui-Calendar-yearMonth shr-me-0.5 shr-text-base shr-font-bold',
    monthButtons: 'smarthr-ui-Calendar-monthButtons shr-ms-auto shr-flex',
    tableLayout: 'shr-relative',
  },
})

export const Calendar = forwardRef<HTMLDivElement, Props & ElementProps>(
  ({ from = minDate, to, onSelectDate, value, className, ...props }, ref) => {
    const { containerStyle, yearMonthStyle, headerStyle, monthButtonsStyle, tableLayoutStyle } =
      useMemo(() => {
        const { container, yearMonth, header, monthButtons, tableLayout } = calendar()
        return {
          containerStyle: container({ className }),
          headerStyle: header(),
          yearMonthStyle: yearMonth(),
          monthButtonsStyle: monthButtons(),
          tableLayoutStyle: tableLayout(),
        }
      }, [className])
    const fromDate = dayjs(getFromDate(from))
    const toDate = dayjs(getToDate(to))
    const today = dayjs()
    const currentDay = toDate.isBefore(today) ? toDate : fromDate.isAfter(today) ? fromDate : today
    const isValidValue = value && isBetween(value, fromDate.toDate(), toDate.toDate())

    const [currentMonth, setCurrentMonth] = useState(isValidValue ? dayjs(value) : currentDay)
    const [isSelectingYear, setIsSelectingYear] = useState(false)

    const yearPickerId = useId()

    useEffect(() => {
      if (value && isValidValue) {
        setCurrentMonth(dayjs(value))
      }
    }, [value, isValidValue])

    const prevMonth = currentMonth.subtract(1, 'month')
    const nextMonth = currentMonth.add(1, 'month')

    return (
      // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
      <Section {...props} ref={ref} className={containerStyle}>
        <header className={headerStyle}>
          <div className={yearMonthStyle}>
            {currentMonth.year()}年{currentMonth.month() + 1}月
          </div>
          <Button
            onClick={(e) => {
              e.stopPropagation()
              setIsSelectingYear(!isSelectingYear)
            }}
            size="s"
            square
            aria-expanded={isSelectingYear}
            aria-controls={yearPickerId}
            className="smarthr-ui-Calendar-selectingYear"
          >
            {isSelectingYear ? (
              <FaCaretUpIcon alt="年を選択する" />
            ) : (
              <FaCaretDownIcon alt="年を選択する" />
            )}
          </Button>
          <Cluster gap={0.5} className={monthButtonsStyle}>
            <Button
              disabled={isSelectingYear || prevMonth.isBefore(fromDate, 'month')}
              onClick={() => setCurrentMonth(prevMonth)}
              size="s"
              square
              className="smarthr-ui-Calendar-monthButtonPrev"
            >
              <FaChevronLeftIcon alt="前の月へ" />
            </Button>
            <Button
              disabled={isSelectingYear || nextMonth.isAfter(toDate, 'month')}
              onClick={() => setCurrentMonth(nextMonth)}
              size="s"
              square
              className="smarthr-ui-Calendar-monthButtonNext"
            >
              <FaChevronRightIcon alt="次の月へ" />
            </Button>
          </Cluster>
        </header>
        <div className={tableLayoutStyle}>
          <YearPicker
            fromYear={fromDate.year()}
            toYear={toDate.year()}
            selectedYear={value?.getFullYear()}
            onSelectYear={(year) => {
              setCurrentMonth(currentMonth.year(year))
              setIsSelectingYear(false)
            }}
            isDisplayed={isSelectingYear}
            id={yearPickerId}
          />
          <CalendarTable
            current={currentMonth.toDate()}
            from={fromDate.toDate()}
            to={toDate.toDate()}
            onSelectDate={onSelectDate}
            selected={isValidValue ? value : null}
          />
        </div>
      </Section>
    )
  },
)
