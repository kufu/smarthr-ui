'use client'

import dayjs from 'dayjs'
import {
  type ComponentProps,
  type MouseEvent,
  type PropsWithChildren,
  forwardRef,
  memo,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useLatest } from '../../hooks/useLatest'
import { Localizer, useDateFormat } from '../../intl'
import { Button } from '../Button'
import { FaCaretDownIcon, FaChevronLeftIcon, FaChevronRightIcon } from '../Icon'
import { Cluster } from '../Layout'

import { CalendarTable } from './CalendarTable'
import { YearPicker } from './YearPicker'
import { getFromDate, getMonthArray, getToDate, isBetween, minDate } from './calendarHelper'

type BaseProps = {
  /** 選択可能な開始日 */
  from?: Date
  /** 選択可能な終了日 */
  to?: Date
  /** トリガのセレクトイベントを処理するハンドラ */
  onSelectDate: (e: MouseEvent, date: Date) => void
  /** 選択された日付 */
  value?: Date
}
type Props = BaseProps & Omit<ComponentProps<'div'>, keyof BaseProps>

type DayJsType = ReturnType<typeof dayjs>

const classNameGenerator = tv({
  slots: {
    container:
      'smarthr-ui-Calendar shr-inline-block shr-overflow-hidden shr-rounded-m shr-bg-white shr-text-black shr-shadow-layer-3 forced-colors:shr-border-shorthand forced-colors:shr-shadow-none',
    header: 'smarthr-ui-Calendar-header shr-border-b-shorthand shr-flex shr-items-center shr-p-1',
    yearMonth: 'smarthr-ui-Calendar-yearMonth shr-me-0.5 shr-text-base shr-font-bold',
    monthButtons: 'smarthr-ui-Calendar-monthButtons shr-ms-auto shr-flex',
    tableLayout: 'shr-relative',
    yearSelectButton:
      'smarthr-ui-Calendar-selectingYear [&[aria-expanded="true"]_.smarthr-ui-Icon]:shr-rotate-180',
  },
})

export const Calendar = forwardRef<HTMLDivElement, Props>(
  ({ from = minDate, to, onSelectDate, value, className, ...rest }, ref) => {
    const { formatDate, getWeekStartDay } = useDateFormat()

    const classNames = useMemo(() => {
      const { container, yearMonth, header, monthButtons, tableLayout, yearSelectButton } =
        classNameGenerator()

      return {
        container: container({ className }),
        header: header(),
        yearMonth: yearMonth(),
        monthButtons: monthButtons(),
        tableLayout: tableLayout(),
        yearSelectButton: yearSelectButton(),
      }
    }, [className])

    const formattedFrom = useMemo(() => {
      const date = getFromDate(from)
      const day = dayjs(date)

      return {
        day,
        date,
        year: day.year(),
      }
    }, [from])
    const formattedTo = useMemo(() => {
      const date = getToDate(to)
      const day = dayjs(date)

      return {
        day,
        date,
        year: day.year(),
      }
    }, [to])

    const isValidValue = useMemo(
      () => value && isBetween(value, formattedFrom.date, formattedTo.date),
      [value, formattedFrom.date, formattedTo.date],
    )

    const [currentMonth, setCurrentMonth] = useState(() => {
      if (isValidValue) {
        return dayjs(value)
      }

      const today = dayjs()

      return formattedTo.day.isBefore(today)
        ? formattedTo.day
        : formattedFrom.day.isAfter(today)
          ? formattedFrom.day
          : today
    })
    const [isSelectingYear, setIsSelectingYear] = useState(false)

    const yearPickerId = useId()

    useEffect(() => {
      if (isValidValue) {
        setCurrentMonth(dayjs(value))
      }
    }, [value, isValidValue])

    const calculatedCurrentMonth = useMemo(() => {
      const d = currentMonth.toDate()

      return {
        prev: currentMonth.subtract(1, 'month'),
        next: currentMonth.add(1, 'month'),
        day: currentMonth,
        months: getMonthArray(d, getWeekStartDay()),
        yearMonthText: formatDate({
          date: d,
          parts: ['year', 'month'],
          options: {
            disableSlashInJa: true,
            capitalizeFirstLetter: true,
          },
        }),
        selectedText: currentMonth.toString(),
      }
    }, [currentMonth, formatDate, getWeekStartDay])

    const functions = useMemo(
      () => ({
        handleSelectYear: (e: MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation()

          const year = parseInt(e.currentTarget.value, 10)

          setCurrentMonth((prev) => prev.year(year))
          setIsSelectingYear(false)
        },
        handleClickSelectYear: (e: MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation()
          setIsSelectingYear((current) => !current)
        },
      }),
      [],
    )

    return (
      <div {...rest} ref={ref} className={classNames.container}>
        <header className={classNames.header}>
          <YearMonthRender className={classNames.yearMonth}>
            {calculatedCurrentMonth.yearMonthText}
          </YearMonthRender>
          <YearSelectButton
            className={classNames.yearSelectButton}
            aria-expanded={isSelectingYear}
            aria-controls={yearPickerId}
            handleClick={functions.handleClickSelectYear}
          />
          <MonthDirectionCluster
            isSelectingYear={isSelectingYear}
            directionMonth={calculatedCurrentMonth}
            from={formattedFrom.day}
            to={formattedTo.day}
            className={classNames.monthButtons}
            setCurrentMonth={setCurrentMonth}
          />
        </header>
        <div className={classNames.tableLayout}>
          <YearPicker
            id={yearPickerId}
            selectedYear={value?.getFullYear()}
            fromYear={formattedFrom.year}
            toYear={formattedTo.year}
            isDisplayed={isSelectingYear}
            handleSelectYear={functions.handleSelectYear}
          />
          <CalendarTable
            selectedDayText={isValidValue ? calculatedCurrentMonth.selectedText : ''}
            current={calculatedCurrentMonth}
            from={formattedFrom.date}
            to={formattedTo.date}
            onSelectDate={onSelectDate}
          />
        </div>
      </div>
    )
  },
)

const YearMonthRender = memo<PropsWithChildren<{ className: string }>>(
  ({ children, className }) => <div className={className}>{children}</div>,
)

const YearSelectButton = memo<{
  'aria-expanded': boolean
  'aria-controls': string
  handleClick: (e: MouseEvent<HTMLButtonElement>) => void
  className: string
}>(({ handleClick, ...rest }) => (
  <Button {...rest} size="S" onClick={handleClick}>
    <FaCaretDownIcon
      alt={<Localizer id="smarthr-ui/Calendar/selectYear" defaultText="年を選択する" />}
    />
  </Button>
))

const MonthDirectionCluster = memo<{
  isSelectingYear: boolean
  directionMonth: {
    prev: DayJsType
    next: DayJsType
  }
  from: DayJsType
  to: DayJsType
  setCurrentMonth: (day: DayJsType) => void
  className: string
}>(({ isSelectingYear, directionMonth: { prev, next }, from, to, setCurrentMonth, className }) => {
  const latest = useLatest({ prev, next, setCurrentMonth })

  const functions = useMemo(
    () => ({
      handleClickMonthPrev: () => latest.setCurrentMonth(latest.prev),
      handleClickMonthNext: () => latest.setCurrentMonth(latest.next),
    }),
    [latest],
  )

  return (
    <Cluster gap={0.5} className={className}>
      <Button
        disabled={isSelectingYear || prev.isBefore(from, 'month')}
        size="S"
        className="smarthr-ui-Calendar-monthButtonPrev"
        onClick={functions.handleClickMonthPrev}
      >
        <FaChevronLeftIcon
          alt={<Localizer id="smarthr-ui/Calendar/previousMonth" defaultText="前の月へ" />}
        />
      </Button>
      <Button
        disabled={isSelectingYear || next.isAfter(to, 'month')}
        size="S"
        className="smarthr-ui-Calendar-monthButtonNext"
        onClick={functions.handleClickMonthNext}
      >
        <FaChevronRightIcon
          alt={<Localizer id="smarthr-ui/Calendar/nextMonth" defaultText="次の月へ" />}
        />
      </Button>
    </Cluster>
  )
})
