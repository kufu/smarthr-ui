import { type ComponentProps, type FC, useCallback } from 'react'

import { useLatest } from '../../hooks/useLatest'
import { useIntl } from '../../intl'
import { DatePicker } from '../DatePicker'

type Props = Omit<ComponentProps<typeof DatePicker>, 'showAlternative'>

const handleShowWareki = (date: Date | null, locale: string) => {
  if (!date) {
    return null
  }

  // 和暦を使う
  return date.toLocaleDateString(`${locale}-u-ca-japanese`, {
    dateStyle: 'long',
  })
}

export const WarekiPicker: FC<Props> = (props) => {
  const { locale } = useIntl()
  const latest = useLatest({ locale })
  const showAlternative = useCallback(
    (date: Date | null) => handleShowWareki(date, latest.locale),
    [latest],
  )

  return <DatePicker {...props} showAlternative={showAlternative} />
}
