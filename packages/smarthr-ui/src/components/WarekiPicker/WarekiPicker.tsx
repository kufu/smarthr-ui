import { DatePicker } from '../DatePicker'

import type { ComponentProps, FC } from 'react'

type Props = Omit<ComponentProps<typeof DatePicker>, 'showAlternative'>

const handleShowWareki = (date: Date | null) =>
  date?.toLocaleDateString('ja-JP-u-ca-japanese', {
    dateStyle: 'long',
  })

export const WarekiPicker: FC<Props> = (props) => (
  <DatePicker {...props} showAlternative={handleShowWareki} />
)
