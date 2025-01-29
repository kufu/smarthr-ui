'use client'

import dayjs from 'dayjs'
import React, {
  ComponentProps,
  MouseEvent,
  forwardRef,
  useCallback,
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
    const styles = useMemo(() => {
      const { container, yearMonth, header, monthButtons, tableLayout } = calendar()

      return {
        container: container({ className }),
        header: header(),
        yearMonth: yearMonth(),
        monthButtons: monthButtons(),
        tableLayout: tableLayout(),
      }
    }, [className])

    const froms = useMemo(() => {
      const day = dayjs(getFromDate(from))

      return {
        day,
        date: day.toDate(),
        year: day.year(),
      }
    }, [from])
    const tos = useMemo(() => {
      const day = dayjs(getToDate(to))

      return {
        day,
        date: day.toDate(),
        year: day.year(),
      }
    }, [to])

    const isValidValue = useMemo(
      () => value && isBetween(value, froms.date, tos.date),
      [value, froms.date, tos.date],
    )

    const [currentMonth, setCurrentMonth] = useState(
      (() => {
        if (isValidValue) {
          return dayjs(value)
        }

        const today = dayjs()

        return tos.day.isBefore(today) ? tos.day : froms.day.isAfter(today) ? froms.day : today
      })(),
    )
    const [isSelectingYear, setIsSelectingYear] = useState(false)

    const yearPickerId = useId()

    useEffect(() => {
      if (value && isValidValue) {
        setCurrentMonth(dayjs(value))
      }
    }, [value, isValidValue])

    const calculatedCurrentMonth = useMemo(
      () => ({
        prev: currentMonth.subtract(1, 'month'),
        next: currentMonth.add(1, 'month'),
        year: currentMonth.year(),
        month: currentMonth.month() + 1,
        date: currentMonth.toDate(),
      }),
      [currentMonth],
    )

    const onSelectYear = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        setCurrentMonth(currentMonth.year(parseInt(e.currentTarget.value, 10)))
        setIsSelectingYear(false)
      },
      [currentMonth],
    )

    const onClickMonthPrev = useCallback(
      () => setCurrentMonth(calculatedCurrentMonth.prev),
      [calculatedCurrentMonth.prev],
    )
    const onClickMonthNext = useCallback(
      () => setCurrentMonth(calculatedCurrentMonth.next),
      [calculatedCurrentMonth.next],
    )

    return (
      // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
      <Section {...props} ref={ref} className={styles.container}>
        <header className={styles.header}>
          <div className={styles.yearMonth}>
            {calculatedCurrentMonth.year}年{calculatedCurrentMonth.month}月
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
          <Cluster gap={0.5} className={styles.monthButtons}>
            <Button
              disabled={isSelectingYear || calculatedCurrentMonth.prev.isBefore(froms.day, 'month')}
              onClick={onClickMonthPrev}
              size="s"
              square
              className="smarthr-ui-Calendar-monthButtonPrev"
            >
              <FaChevronLeftIcon alt="前の月へ" />
            </Button>
            <Button
              disabled={isSelectingYear || calculatedCurrentMonth.next.isAfter(tos.day, 'month')}
              onClick={onClickMonthNext}
              size="s"
              square
              className="smarthr-ui-Calendar-monthButtonNext"
            >
              <FaChevronRightIcon alt="次の月へ" />
            </Button>
          </Cluster>
        </header>
        <div className={styles.tableLayout}>
          <YearPicker
            fromYear={froms.year}
            toYear={tos.year}
            selectedYear={value?.getFullYear()}
            onSelectYear={onSelectYear}
            isDisplayed={isSelectingYear}
            id={yearPickerId}
          />
          <CalendarTable
            current={calculatedCurrentMonth.date}
            from={froms.date}
            to={tos.date}
            onSelectDate={onSelectDate}
            selected={isValidValue ? value : null}
          />
        </div>
      </Section>
    )
  },
)
