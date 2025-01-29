import dayjs from 'dayjs'
import React, { ComponentPropsWithoutRef, FC, MouseEvent, useCallback, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { UnstyledButton } from '../Button'

import { daysInWeek, getMonthArray, isBetween } from './calendarHelper'

type Props = {
  /** 現在の日付 */
  current: Date
  /** 選択可能な開始日 */
  from: Date
  /** 選択可能な終了日 */
  to: Date
  /** トリガのセレクトイベントを処理するハンドラ */
  onSelectDate: (e: MouseEvent, date: Date) => void
  /** 選択された日付 */
  selected?: Date | null
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
  selected,
  className,
  ...props
}) => {
  const styles = useMemo(() => {
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

  const currentDay = useMemo(() => dayjs(current), [current])
  const selectedDayStr = useMemo(() => (selected ? dayjs(selected).toString() : ''), [selected])

  const fromDate = useMemo(() => dayjs(from).toDate(), [from])
  const toDate = useMemo(() => dayjs(to).toDate(), [to])

  const months = useMemo(() => getMonthArray(currentDay.toDate()), [currentDay])
  // HINT: dayjsのisSameは文字列でも比較可能なため、cacheが効きやすいstringにする
  const nowDateStr = dayjs().startOf('date').toString()

  return (
    <div className={styles.wrapper}>
      <table {...props} className={styles.table}>
        <thead>
          <tr>
            {daysInWeek.map((day, i) => (
              <th key={i} className={styles.th}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {months.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((date, dateIndex) => {
                if (!date) {
                  return <NullTd key={dateIndex} className={styles.td} />
                }

                return (
                  <SelectButtonTd
                    key={dateIndex}
                    date={date}
                    currentDay={currentDay}
                    selectedDayStr={selectedDayStr}
                    fromDate={fromDate}
                    toDate={toDate}
                    nowDateStr={nowDateStr}
                    onClick={onSelectDate}
                    styles={styles}
                  />
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const NullTd = React.memo<{ className: string }>(({ className }) => <td className={className} />)

const SelectButtonTd = React.memo<{
  date: number
  currentDay: DayJsType
  selectedDayStr: string
  fromDate: Date
  toDate: Date
  nowDateStr: string
  onClick: Props['onSelectDate']
  styles: {
    td: string
    cellButton: string
    dateCell: string
  }
}>(({ date, currentDay, selectedDayStr, fromDate, toDate, nowDateStr, styles }) => {
  const target = useMemo(() => {
    const day = currentDay.date(date)

    return {
      day,
      date: day.toDate(),
    }
  }, [currentDay, date])
  const disabled = useMemo(
    () => !isBetween(target.date, fromDate, toDate),
    [target.date, fromDate, toDate],
  )
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
    <td className={styles.td}>
      <UnstyledButton
        type="button"
        disabled={disabled}
        aria-pressed={ariaPressed}
        onClick={actualOnClick}
        className={styles.cellButton}
        data-is-today={dataIsToday}
      >
        <SelectButtonTdDateCell className={styles.dateCell}>{date}</SelectButtonTdDateCell>
      </UnstyledButton>
    </td>
  )
})

const SelectButtonTdDateCell = React.memo<{ children: number; className: string }>(
  ({ children, className }) => <span className={className}>{children}</span>,
)
