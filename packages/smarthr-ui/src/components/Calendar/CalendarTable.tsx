import dayjs, { useMemo } from 'dayjs'
import React, { ComponentPropsWithoutRef, FC, MouseEvent, useMemo } from 'react'
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
  const selectedDay = useMemo(() => (selected ? dayjs(selected) : null), [selected])

  const fromDate = useMemo(() => dayjs(from).toDate(), [from])
  const toDate = useMemo(() => dayjs(to).toDate(), [to])

  const months = useMemo(() => getMonthArray(currentDay.toDate()), [currentDay])

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
                  return <td key={dateIndex} className={styles.td} />
                }

                const compareDay = currentDay.date(date)
                const compareDate = compareDay.toDate()

                return (
                  <td key={dateIndex} className={styles.td}>
                    <UnstyledButton
                      type="button"
                      disabled={!isBetween(compareDate, fromDate, toDate)}
                      aria-pressed={
                        selectedDay && compareDay.isSame(selectedDay, 'date') ? true : false
                      }
                      onClick={(e) => onSelectDate(e, compareDate)}
                      className={styles.cellButton}
                      data-is-today={compareDay.isSame(dayjs().startOf('date'), 'date')}
                    >
                      <span className={styles.dateCell}>{date}</span>
                    </UnstyledButton>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
