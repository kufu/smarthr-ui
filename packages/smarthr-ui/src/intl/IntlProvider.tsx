'use client'

import React, { FC, PropsWithChildren } from 'react'
import { IntlProvider as ReactIntlProvider } from 'react-intl'

import * as locales from './locales'

type Props = PropsWithChildren<{
  locale: keyof typeof locales
}>

export const IntlProvider: FC<Props> = ({ locale, children }) => (
  <ReactIntlProvider locale={locale} messages={locales[locale]}>
    {children}
  </ReactIntlProvider>
)
