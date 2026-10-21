'use client'

import { type ComponentPropsWithRef, type FC, useCallback } from 'react'

import { useLatest } from '../../../hooks/useLatest'
import { useIntl } from '../../../intl'
import { formatWarekiDate } from '../../../libs/formatWarekiDate'
import { DatePicker } from '../../DatePicker'

type Props = Omit<ComponentPropsWithRef<typeof DatePicker>, 'showAlternative'>

export const WarekiPicker: FC<Props> = (props) => {
  const { locale } = useIntl()
  const latest = useLatest({ locale })
  const showAlternative = useCallback(
    (date: Date | null) => formatWarekiDate(date, latest.locale),
    [latest],
  )

  return <DatePicker {...props} showAlternative={showAlternative} />
}
