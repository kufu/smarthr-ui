import { FormattedMessage as ReactIntlFormattedMessage } from 'react-intl'

import type { ja } from './locales'
import type { ComponentProps } from 'react'

type Messages = Record<keyof typeof ja, string>

type Props<Id extends keyof Messages> = {
  id: Id
  defaultText: (typeof ja)[Id]
  values?: ComponentProps<typeof ReactIntlFormattedMessage>['values']
}

export const Localizer = <ID extends keyof Messages>({
  values,
  id,
  defaultText,
  ...props
}: Props<ID>) => (
  <ReactIntlFormattedMessage
    {...props}
    id={id}
    defaultMessage={defaultText}
    values={{ break: <br />, ...values }}
  />
)
