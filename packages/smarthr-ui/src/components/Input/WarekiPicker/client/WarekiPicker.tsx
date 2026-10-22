'use client'

import { type ComponentPropsWithRef, type FC, useCallback } from 'react'

import { useLatest } from '../../../../hooks/useLatest'
import { useIntl } from '../../../../intl'

import { DatePicker } from './DatePicker'

import type { ExtendProps } from '../../../../types'

type DatePickerProps = ComponentPropsWithRef<typeof DatePicker>
type Props = ExtendProps<
  DatePickerProps,
  { showAlternative?: boolean | DatePickerProps['showAlternative'] }
>

export const WarekiPicker: FC<Props> = ({ showAlternative, ...rest }) => {
  if (typeof showAlternative === 'function') {
    return <DatePicker {...rest} showAlternative={showAlternative} />
  }

  if (showAlternative === false) {
    return <DatePicker {...rest} />
  }

  return <ActualWarekiPicker {...rest} />
}

const ActualWarekiPicker: FC<Omit<Props, 'showAlternative'>> = (props) => {
  const { locale } = useIntl()
  const latest = useLatest({ locale })
  const showAlternative = useCallback(
    (date: Date | null) => {
      if (!date) {
        return null
      }

      // 和暦を使う
      return date.toLocaleDateString(`${latest.locale}-u-ca-japanese`, {
        dateStyle: 'long',
      })
    },
    [latest],
  )

  return <DatePicker {...props} showAlternative={showAlternative} />
}
