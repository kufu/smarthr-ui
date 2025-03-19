'use client'

import { IntlProvider as ReactIntlProvider } from 'react-intl'

import * as locales from './locales'

import type { FC, PropsWithChildren } from 'react'

type Props = PropsWithChildren<{
  locale: keyof typeof locales
}>

export const IntlProvider: FC<Props> = ({ locale, children }) => (
  <ReactIntlProvider locale={locale} messages={locales[locale]}>
    {children}
  </ReactIntlProvider>
)
