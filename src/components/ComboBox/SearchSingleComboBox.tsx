import React from 'react'
import { Base } from './Base'
import { FaSearchIcon } from '../Icon'

type BaseProps<T> = React.ComponentProps<typeof Base<T>>
type Props<T> = Omit<BaseProps<T>, 'dropdownHelpMessage'> & {
  dropdownHelpMessage: BaseProps<T>['dropdownHelpMessage']
}

export function SearchSingleComboBox<T>(props: Props<T>) {
  return <Base {...props} prefix={<FaSearchIcon />} />
}
