import React from 'react'
import { Base } from './Base'

type Props<T> = Omit<React.ComponentProps<typeof Base<T>>, 'prefix'>

export function SingleComboBox<T>(props: Props<T>) {
  return <Base {...props} />
}
