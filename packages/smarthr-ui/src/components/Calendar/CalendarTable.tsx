import dayjs from 'dayjs'
import React, { ComponentPropsWithoutRef, FC, MouseEvent, useCallback, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { UnstyledButton } from '../Button'

import { daysInWeek, isBetween } from './calendarHelper'

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
  selectedDayStr: string
}
type ElementProps = Omit<ComponentPropsWithoutRef<'table'>, keyof Props>

type DayJsType = ReturnType<typeof dayjs>

const calendarTable = tv({
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
  selectedDayStr,
  className,
  ...props
}) => {
  const classNames = useMemo(() => {
    const { wrapper, table, th, td, cellButton, dateCell } = calendarTable()

    return {
      wrapper: wrapper({ className }),
      table: table(),
      th: th(),
      td: td(),
      cellButton: cellButton(),
      dateCell: dateCell(),
    }
  }, [className])

  // HINT: dayjsのisSameは文字列でも比較可能なため、cacheが効きやすいstringにする
  const nowDateStr = dayjs().startOf('date').toString()

  return (
    <div className={classNames.wrapper}>
      <table {...props} className={classNames.table}>
        <MemoizedThead thStyle={classNames.th} />
        <tbody>
          {current.months.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((date, dateIndex) =>
                date ? (
                  <SelectTdButton
                    key={dateIndex}
                    date={date}
                    currentDay={current.day}
                    selectedDayStr={selectedDayStr}
                    from={from}
                    to={to}
                    nowDateStr={nowDateStr}
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

const MemoizedThead = React.memo<{ thStyle: string }>(({ thStyle }) => (
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

const NullTd = React.memo<{ className: string }>(({ className }) => <td className={className} />)

const SelectTdButton = React.memo<{
  date: number
  currentDay: DayJsType
  selectedDayStr: string
  from: Date
  to: Date
  nowDateStr: string
  onClick: Props['onSelectDate']
  classNames: {
    td: string
    cellButton: string
    dateCell: string
  }
}>(({ date, currentDay, selectedDayStr, from, to, nowDateStr, onClick, classNames }) => {
  const target = useMemo(() => {
    const day = currentDay.date(date)

    return {
      day,
      date: day.toDate(),
    }
  }, [currentDay, date])
  const disabled = useMemo(() => !isBetween(target.date, from, to), [target.date, from, to])
  const ariaPressed = useMemo(
    () => target.day.isSame(selectedDayStr, 'date'),
    [selectedDayStr, target.day],
  )
  const dataIsToday = useMemo(() => target.day.isSame(nowDateStr, 'date'), [nowDateStr, target.day])

  const actualOnClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
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

const SelectButtonTdDateCell = React.memo<{ children: number; className: string }>(
  ({ children, className }) => <span className={className}>{children}</span>,
)
