'use client'

import React, { FC, PropsWithChildren } from 'react'
import { IntlProvider as ReactIntlProvider } from 'react-intl'

import { locale as ja } from '../../locales/ja'
import { Messages } from '../../locales/types'

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
