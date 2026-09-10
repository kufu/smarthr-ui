'use client'

// HINT: react-intlはRSC非対応（モジュールスコープでcreateContextを呼びガードが無い）。
// react-server条件でimportするとTypeErrorになるため、利用側へ境界を移せない。
import { useMemo } from 'react'
import {
  type IntlShape,
  type PrimitiveType,
  type MessageDescriptor as ReactIntlMessageDescriptor,
  createIntl,
  createIntlCache,
} from 'react-intl'
import { useIntl as useSmartHRUIIntl } from 'smarthr-ui'

import { type Locale, locales, type typedJa } from './locales'

import type { FormatXMLElementFn, Options as IntlMessageFormatOptions } from 'intl-messageformat'

type Messages = Record<keyof typeof typedJa, string>

type MessageDescriptor<T extends keyof Messages> = Omit<ReactIntlMessageDescriptor, 'id'> & {
  id: T
  defaultText: (typeof typedJa)[T]
}

export type UseIntlReturn = {
  /** メッセージのローカライズ関数 */
  localize: <T extends keyof Messages>(
    descriptor: MessageDescriptor<T>,
    values?: Record<string, PrimitiveType | FormatXMLElementFn<string, string>>,
    opts?: IntlMessageFormatOptions,
  ) => string
  /** 現在のロケール */
  locale: Locale
}

// HINT: 入れ子のProviderで本体のmessagesを上書きしないよう、専用の辞書だけを持つformatterを使う。
// formatterはlocale単位で使い回す。レンダリングのたびに全辞書を組み立てない。
const cache = createIntlCache()
const formatters = new Map<Locale, IntlShape>()

const getFormatter = (locale: Locale): IntlShape => {
  const cached = formatters.get(locale)

  if (cached) {
    return cached
  }

  const formatter = createIntl({ locale, messages: locales[locale] }, cache)

  formatters.set(locale, formatter)

  return formatter
}

/**
 * RichTextEditor専用のメッセージをローカライズするフック
 * localeはsmarthr-uiのIntlProviderが正規化したものをそのまま使う
 */
export const useIntl = (): UseIntlReturn => {
  const { locale } = useSmartHRUIIntl()

  return useMemo(
    () => ({
      localize: <T extends keyof Messages>(
        descriptor: MessageDescriptor<T>,
        values?: Record<string, PrimitiveType | FormatXMLElementFn<string, string>>,
        opts?: IntlMessageFormatOptions,
      ): string =>
        getFormatter(locale).formatMessage(
          { ...descriptor, defaultMessage: descriptor.defaultText },
          values,
          opts,
        ),
      locale,
    }),
    [locale],
  )
}
