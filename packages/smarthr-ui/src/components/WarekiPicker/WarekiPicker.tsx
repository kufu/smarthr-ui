import { useIntl } from '../../intl'
import { DatePicker } from '../DatePicker'

import type { ComponentProps, FC } from 'react'

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

  return (
    <DatePicker
      {...props}
      showAlternative={(date: Date | null) => handleShowWareki(date, locale)}
    />
  )
}
