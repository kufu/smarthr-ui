import dayjs from 'dayjs'

export const daysInWeek = ['日', '月', '火', '水', '木', '金', '土']

export function getFromDate(date?: Date): Date {
  const min = new Date(1970, 0, 1)
  if (!date || isNaN(date.getTime()) || date.getTime() < 0) {
    return min
  }
  return date
}

export function getToDate(date?: Date): Date {
  if (!date || isNaN(date.getTime())) {
    return dayjs().add(50, 'year').toDate()
  }
  const max = new Date(9999, 11, 31)
  if (date.getTime() > max.getTime()) {
    return max
  }
  return date
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
      if (dateNum > 0 && dateNum <= lastDate) {
        return dateNum
      }
      return null
    })
  })
}

export function isBetween(date: Date, from: Date, to: Date) {
  const time = date.getTime()
  const fromTime = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime()
  const toTime = new Date(to.getFullYear(), to.getMonth(), to.getDate() + 1).getTime()
  return time >= fromTime && time < toTime
}
