import dayjs from 'dayjs'
import dayjsIsBetween from 'dayjs/plugin/isBetween'

dayjs.extend(dayjsIsBetween)

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

export function getMonthArray(date: Date, weekStartDay: number = 0) {
  const day = dayjs(date)

  // 月の最初の日の曜日を取得（0=日曜日, 1=月曜日, ..., 6=土曜日）
  const firstDayOfMonth = day.date(1).day()

  // 週の開始日からのオフセットを計算
  // weekStartDay を基準とした場合の月の最初の日の位置を計算
  const startDay = (firstDayOfMonth - weekStartDay + 7) % 7

  const lastDate = day.add(1, 'month').date(0).date()
  const numOfWeek = Math.ceil((lastDate + startDay) / 7)

  const result: Array<Array<number | null>> = []

  for (let weekIndex = 0; weekIndex < numOfWeek; weekIndex++) {
    // 週毎の配列を形成
    const startDateInWeek = weekIndex * 7 - startDay + 1
    const weekNumbers: Array<number | null> = []

    for (let dateIndex = 0; dateIndex < 7; dateIndex++) {
      // 1週の配列を形成
      const dateNum = startDateInWeek + dateIndex

      weekNumbers[dateIndex] = dateNum > 0 && dateNum <= lastDate ? dateNum : null
    }

    result[weekIndex] = weekNumbers
  }

  return result
}

export function isBetween(date: Date, from: Date, to: Date) {
  return dayjs(date).isBetween(from, to, 'day', '[]')
}
