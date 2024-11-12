import dayjs from 'dayjs'
import dayjsIsBetween from 'dayjs/plugin/isBetween'

dayjs.extend(dayjsIsBetween)

export const daysInWeek = ['日', '月', '火', '水', '木', '金', '土']

export const minDate = new Date(1900, 0, 1)
const minDatetime = minDate.getTime()
const maxDate = new Date(9999, 11, 31)
const maxDatetime = maxDate.getTime()

export function getFromDate(date: Date): Date {
  const time = date.getTime()

  return isNaN(time) || time < minDatetime ? minDate : date
}

export function getToDate(date?: Date): Date {
  if (!date) {
    return dayjs().add(50, 'year').toDate()
  }

  const time = date.getTime()

  if (isNaN(time)) {
    return dayjs().add(50, 'year').toDate()
  }

  return time > maxDatetime ? maxDate : date
}

export function getMonthArray(date: Date) {
  const startDay = dayjs(date).date(1).day()
  const lastDate = dayjs(date).add(1, 'month').date(0).date()
  const numOfWeek = Math.ceil((lastDate + startDay) / 7)

  return Array.from({ length: numOfWeek }).map((_, weekIndex) => {
    // 週毎の配列を形成
    const startDateInWeek = weekIndex * 7 - startDay + 1
    return Array.from({ length: 7 }).map((__, dateIndex) => {
      // 1週の配列を形成
      const dateNum = startDateInWeek + dateIndex

      return dateNum > 0 && dateNum <= lastDate ? dateNum : null
    })
  })
}

export function isBetween(date: Date, from: Date, to: Date) {
  return dayjs(date).isBetween(from, to, 'day', '[]')
}
