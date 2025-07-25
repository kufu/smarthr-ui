import dayjs from 'dayjs'
import {
  type ComponentPropsWithoutRef,
  type FC,
  type MouseEvent,
  memo,
  useCallback,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../intl'
import { UnstyledButton } from '../Button'

import { isBetween } from './calendarHelper'

type Props = {
  /** 現在の日付 */
  current: {
    day: DayJsType
    months: Array<Array<number | null>>
  }
  /** 選択可能な開始日 */
  from: Date
  /** 選択可能な終了日 */
  to: Date
  /** トリガのセレクトイベントを処理するハンドラ */
  onSelectDate: (e: MouseEvent, date: Date) => void
  /** 選択された日付 */
  selectedDayText: string
}
type ElementProps = Omit<ComponentPropsWithoutRef<'table'>, keyof Props>

type DayJsType = ReturnType<typeof dayjs>

// 2024年1月の最初の週の日曜日を基準日として定義
const BASE_CALENDAR_START = dayjs('2024-01-07')

const classNameGenerator = tv({
  slots: {
    wrapper: 'shr-px-0.75 shr-pb-1 shr-pt-0.25',
    table: 'smarthr-ui-CalendarTable shr-border-spacing-0 shr-text-base shr-text-black',
    th: 'smarthr-ui-CalendarTable-headCell shr-px-0 shr-py-0.5 shr-text-center shr-align-middle shr-font-normal shr-text-grey',
    td: 'smarthr-ui-CalendarTable-dataCell shr-p-0 shr-align-middle',
    cellButton:
      'shr-group shr-flex shr-items-center shr-justify-center shr-px-0.5 shr-py-0.25 disabled:shr-cursor-not-allowed disabled:shr-text-disabled',
    dateCell: [
      'shr-box-border shr-flex shr-h-[1.75rem] shr-w-[1.75rem] shr-items-center shr-justify-center shr-rounded-[50%] shr-leading-[0] group-[:not(:disabled)]:group-hover:shr-bg-base-grey group-[:not(:disabled)]:group-hover:shr-text-black',
      '[[aria-pressed="true"]>&&&]:shr-bg-main [[aria-pressed="true"]>&&&]:shr-text-white',
      '[[data-is-today="true"]>&&&]:shr-border-shorthand [[aria-pressed="true"]>&&&]:contrast-more:shr-border-high-contrast',
    ],
  },
})

export const CalendarTable: FC<Props & ElementProps> = ({
  current,
  from,
  to,
  onSelectDate,
  selectedDayText,
  className,
  ...props
}) => {
  const { formatDate, getWeekStartDay } = useIntl()

  const classNames = useMemo(() => {
    const { wrapper, table, th, td, cellButton, dateCell } = classNameGenerator()

    return {
      wrapper: wrapper({ className }),
      table: table(),
      th: th(),
      td: td(),
      cellButton: cellButton(),
      dateCell: dateCell(),
    }
  }, [className])

  // ロケールに応じた週の開始日から国際化された曜日名を生成
  const daysInWeek = useMemo(() => {
    const weekStartDay = getWeekStartDay()
    const days = []

    for (let i = 0; i < 7; i++) {
      const dayOfWeek = (weekStartDay + i) % 7
      const baseDate = BASE_CALENDAR_START.add(dayOfWeek, 'day').toDate()
      days.push(
        formatDate({
          date: baseDate,
          parts: ['weekday'],
          options: { capitalizeFirstLetter: true },
        }),
      )
    }

    return days
  }, [formatDate, getWeekStartDay])

  // HINT: dayjsのisSameは文字列でも比較可能なため、cacheが効きやすいstringにする
  const nowDateText = dayjs().startOf('date').toString()

  return (
    <div className={classNames.wrapper}>
      <table {...props} className={classNames.table}>
        <MemoizedThead thStyle={classNames.th} daysInWeek={daysInWeek} />
        <tbody>
          {current.months.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((date, dateIndex) =>
                date ? (
                  <SelectTdButton
                    key={dateIndex}
                    date={date}
                    currentDay={current.day}
                    selectedDayText={selectedDayText}
                    from={from}
                    to={to}
                    nowDateText={nowDateText}
                    onClick={onSelectDate}
                    classNames={classNames}
                  />
                ) : (
                  <NullTd key={dateIndex} className={classNames.td} />
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const MemoizedThead = memo<{ thStyle: string; daysInWeek: string[] }>(({ thStyle, daysInWeek }) => (
  <thead>
    <tr>
      {daysInWeek.map((day) => (
        <th key={day} className={thStyle}>
          {day}
        </th>
      ))}
    </tr>
  </thead>
))

const NullTd = memo<{ className: string }>(({ className }) => <td className={className} />)

const SelectTdButton = memo<{
  date: number
  currentDay: DayJsType
  selectedDayText: string
  from: Date
  to: Date
  nowDateText: string
  onClick: Props['onSelectDate']
  classNames: {
    td: string
    cellButton: string
    dateCell: string
  }
}>(({ date, currentDay, selectedDayText, from, to, nowDateText, onClick, classNames }) => {
  const target = useMemo(() => {
    const day = currentDay.date(date)

    return {
      day,
      date: day.toDate(),
    }
  }, [currentDay, date])
  const disabled = useMemo(() => !isBetween(target.date, from, to), [target.date, from, to])
  const ariaPressed = useMemo(
    () => target.day.isSame(selectedDayText, 'date'),
    [selectedDayText, target.day],
  )
  const dataIsToday = useMemo(
    () => target.day.isSame(nowDateText, 'date'),
    [nowDateText, target.day],
  )

  const actualOnClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      onClick(e, target.date)
    },
    [onClick, target.date],
  )

  return (
    <td className={classNames.td}>
      <UnstyledButton
        type="button"
        disabled={disabled}
        aria-pressed={ariaPressed}
        onClick={actualOnClick}
        className={classNames.cellButton}
        data-is-today={dataIsToday}
      >
        <SelectButtonTdDateCell className={classNames.dateCell}>{date}</SelectButtonTdDateCell>
      </UnstyledButton>
    </td>
  )
})

const SelectButtonTdDateCell = memo<{ children: number; className: string }>(
  ({ children, className }) => <span className={className}>{children}</span>,
)
