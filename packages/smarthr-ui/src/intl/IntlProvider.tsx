'use client'

import { type FC, type PropsWithChildren, createContext, useContext, useMemo } from 'react'
import { IntlContext, IntlProvider as ReactIntlProvider } from 'react-intl'

import { type Locale, localeMap } from './localeMap'
import * as locales from './locales'

// Object.keys は常に string[] を返却するが、locales は実行時に変更されないため、as 型キャストを使用することは自明に安全なので使用している
const allLocaleKeys = Object.keys(localeMap) as Locale[]

type Props<AvailableLocales extends Locale[] = typeof allLocaleKeys> = PropsWithChildren<{
  locale: AvailableLocales[number]
  availableLocales?: AvailableLocales
}>

const AvailableLocalesContext = createContext<Locale[]>(allLocaleKeys)

export const useAvailableLocales = () => useContext(AvailableLocalesContext)

export const IntlProvider = <AvailableLocales extends Locale[] = typeof allLocaleKeys>({
  availableLocales,
  locale,
  children,
}: Props<AvailableLocales>): ReturnType<FC> => {
  // プロダクト側でIntlProviderを使っている場合、プロダクト側のmessagesとマージして提供するためにContextから取得している
  const intl = useContext(IntlContext)
  const actualMessages = useMemo(() => ({ ...intl?.messages, ...locales[locale] }), [intl, locale])

  return (
    <AvailableLocalesContext.Provider value={availableLocales ?? allLocaleKeys}>
      <ReactIntlProvider locale={locale} messages={actualMessages}>
        {children}
      </ReactIntlProvider>
    </AvailableLocalesContext.Provider>
  )
}
