'use client'

import { type FC, type PropsWithChildren, useContext, useMemo } from 'react'
import { IntlContext, IntlProvider as ReactIntlProvider } from 'react-intl'

import * as locales from './locales'

type Props = PropsWithChildren<{
  locale: keyof typeof locales
}>

export const IntlProvider: FC<Props> = ({ locale, children }) => {
  // プロダクト側でIntlProviderを使っている場合、プロダクト側のmessagesとマージして提供するためにContextから取得している
  const intl = useContext(IntlContext)
  const actualMessages = useMemo(() => ({ ...intl?.messages, ...locales[locale] }), [intl, locale])

  return (
    <ReactIntlProvider locale={locale} messages={actualMessages}>
      {children}
    </ReactIntlProvider>
  )
}
