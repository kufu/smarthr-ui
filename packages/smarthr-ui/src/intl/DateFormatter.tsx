import { useIntl } from './useIntl'

type Props = {
  date: Date
  options?: Intl.DateTimeFormatOptions & { jaFormat?: boolean }
}

export const DateFormatter = ({ date }: Props) => {
  const { formatDate } = useIntl()
  return <time dateTime={date.toISOString()}>{formatDate(date)}</time>
}
