import React from 'react'
import { Base } from './Base'
import { FaSearchIcon } from '../Icon'

type BaseProps<T> = React.ComponentProps<typeof Base<T>>
// HINT: 検索ボックスとして利用を想定しているため、defaultItemは不要
type Props<T> = Omit<BaseProps<T>, 'prefix' | 'defaultItem' | 'dropdownHelpMessage'> &
  Pick<Required<BaseProps<T>>, 'dropdownHelpMessage'>

export function SearchSingleComboBox<T>(props: Props<T>) {
  return Base<T>({ ...props, prefix: <FaSearchIcon /> })
}
