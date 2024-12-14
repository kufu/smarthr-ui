import React, { ComponentProps } from 'react'

import { DatePicker } from '../DatePicker'

type Props = Omit<ComponentProps<typeof DatePicker>, 'showAlternative'>

const handleShowWareki = (date: Date | null) =>
  date?.toLocaleDateString('ja-JP-u-ca-japanese', {
    dateStyle: 'long',
  })

export const WarekiPicker: React.FC<Props> = (props) => (
  // eslint-disable-next-line smarthr/a11y-input-in-form-control
  <DatePicker {...props} showAlternative={handleShowWareki} />
)
