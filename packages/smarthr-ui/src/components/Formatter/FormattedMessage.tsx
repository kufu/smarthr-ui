import React, { ComponentProps } from 'react'
import { FormattedMessage as RawFormattedMessage } from 'react-intl'

import { ja } from '../../locales'

type Messages = Record<keyof typeof ja, string>

type Props<Id extends keyof Messages> = Omit<
  ComponentProps<typeof RawFormattedMessage>,
  'id' | 'defaultMessage'
> & {
  id: Id
  defaultMessage: (typeof ja)[Id]
}

export const FormattedMessage = <ID extends keyof Messages>({ values, ...props }: Props<ID>) => (
  <RawFormattedMessage {...props} values={{ break: <br />, ...values }} />
)
