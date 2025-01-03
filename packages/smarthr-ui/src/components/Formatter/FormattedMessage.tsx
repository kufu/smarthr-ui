import React, { ComponentProps } from 'react'
import { FormattedMessage as RawFormattedMessage } from 'react-intl'

import { locale as ja } from '../../locales/ja'
import { Messages } from '../../locales/types'

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
