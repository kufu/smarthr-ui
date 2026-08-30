'use client'

// HINT: react-intlはRSC非対応（モジュールスコープでcreateContextを呼びガードが無い）。
// react-server条件でimportするとTypeErrorになるため、利用側へ境界を移せない。
import { type ComponentProps, memo } from 'react'
import { FormattedMessage as ReactIntlFormattedMessage } from 'react-intl'

import type { typedJa } from './locales'

type Messages = Record<keyof typeof typedJa, string>

type Props<Id extends keyof Messages> = {
  id: Id
  defaultText: (typeof typedJa)[Id]
  values?: ComponentProps<typeof ReactIntlFormattedMessage>['values']
}

const LocalizerInner = <ID extends keyof Messages>({
  values,
  id,
  defaultText,
  ...rest
}: Props<ID>) => (
  <ReactIntlFormattedMessage
    {...rest}
    id={id}
    defaultMessage={defaultText}
    values={{ ...values, break: values?.break ?? <br /> }}
  />
)

// eslint-disable-next-line smarthr/best-practice-for-no-unnecessary-variable
const typedMemo: <T>(c: T) => T = memo
export const Localizer = typedMemo(LocalizerInner)
