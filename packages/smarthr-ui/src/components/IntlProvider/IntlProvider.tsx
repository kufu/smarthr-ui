'use client'

import React, { FC, PropsWithChildren } from 'react'
import { IntlProvider as ReactIntlProvider } from 'react-intl'

import { ja } from '../../locales'

type Messages = Record<keyof typeof ja, string>

const localeMap = {
  ja,
} as const

type Props = PropsWithChildren<{
  locale: keyof typeof localeMap
  messages: Messages
}>

export const IntlProvider: FC<Props> = ({ locale, children }) => (
  <ReactIntlProvider locale={locale} messages={localeMap[locale]}>
    {children}
  </ReactIntlProvider>
)
