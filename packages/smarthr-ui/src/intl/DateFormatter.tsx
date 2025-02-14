import React from 'react'

import { useIntl } from './useIntl'

type Props = {
  date: Date
}

export const DateFormatter = ({ date }: Props) => {
  const { formatDate } = useIntl()
  return <time dateTime={date.toISOString()}>{formatDate(date)}</time>
}
