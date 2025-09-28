'use client'

import { type FC, type PropsWithChildren, createContext, useContext, useMemo } from 'react'
import { IntlContext, IntlProvider as ReactIntlProvider } from 'react-intl'

import { type Locale, localeMap } from './localeMap'
import * as locales from './locales'

// Object.keys は常に string[] を返却するが、locales は実行時に変更されないため、as 型キャストを使用することは自明に安全なので使用している
const allLocaleKeys = Object.keys(localeMap) as Locale[]

type Props<AvailableLocales extends Locale[] = typeof allLocaleKeys> = PropsWithChildren<{
  locale: string
  availableLocales?: string[]
  // ↑ プロダクト側と smarthr-ui の言語コードの揺れに対応するため、一旦 string, string[] で受け取れるようにする
  // ↓ 本来は AvailableLocales[number], AvailableLocales で受け取りたいが、プロダクトと smarthr-ui での言語コード統一が終わるまで使えない
  _not_used_locale?: AvailableLocales[number]
  _not_used_availableLocales?: AvailableLocales
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

export const Hoge = () => (
  <IntlProvider locale="ja" availableLocales={['ja', 'en-us']}>
    <p>hoge</p>
  </IntlProvider>
)
