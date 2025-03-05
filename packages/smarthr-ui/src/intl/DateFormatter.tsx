import React, { memo } from 'react'

import { useIntl } from './useIntl'

type Props = {
  date: Date
  options?: Intl.DateTimeFormatOptions & { jaFormat?: boolean }
}

export const DateFormatter = memo<Props>(({ date }) => {
  const { formatDate } = useIntl()

  return <time dateTime={date.toISOString()}>{formatDate(date)}</time>
})
