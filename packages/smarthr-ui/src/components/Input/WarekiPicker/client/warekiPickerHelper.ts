import { warekiToDate } from '@smarthr/wareki'
import dayjs from 'dayjs'

export function parseJpnDateString(dateString: string): Date {
  const { isValid, result, formatted } = warekiToDate(dateString)

  return isValid ? result : dayjs(formatted).toDate()
}
