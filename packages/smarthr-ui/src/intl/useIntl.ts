import { useCallback } from 'react'
import {
  PrimitiveType,
  MessageDescriptor as ReactIntlMessageDescriptor,
  useIntl as useReactIntl,
} from 'react-intl'

import * as locales from './locales'

import type { FormatXMLElementFn, Options as IntlMessageFormatOptions } from 'intl-messageformat'

type Messages = Record<keyof typeof locales.ja, string>

type MessageDescriptor<T extends keyof Messages> = Omit<ReactIntlMessageDescriptor, 'id'> & {
  id: T
  defaultMessage: (typeof locales.ja)[T]
}

const DATE_FORMATS: Record<keyof typeof locales, Intl.DateTimeFormatOptions | undefined> = {
  // localeがjaの場合、フォーマットを YYYY/MM/DD 形式にする
  // 参考: https://smarthr.design/products/contents/idiomatic-usage/count/#h2-3
  ja: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  },
  'en-us': undefined,
  'id-id': undefined,
  ko: undefined,
  pt: undefined,
  vi: undefined,
  'zh-cn': undefined,
  'zh-tw': undefined,
} as const

const isValidLocale = (locale: string): locale is keyof typeof locales => locale in locales

export const useIntl = () => {
  const intl = useReactIntl()
  const locale = isValidLocale(intl.locale) ? intl.locale : 'ja'

  const localize = useCallback(
    <T extends keyof Messages>(
      descriptor: MessageDescriptor<T>,
      values?: Record<string, PrimitiveType | FormatXMLElementFn<string, string>>,
      opts?: IntlMessageFormatOptions,
    ): string => intl.formatMessage(descriptor, values, opts),
    [intl],
  )

  const formatDate = useCallback(
    (date: Date, opts?: Intl.DateTimeFormatOptions & { jaFormat?: boolean }): string =>
      intl.formatDate(date, { ...DATE_FORMATS[locale], ...opts }),
    [intl, locale],
  )

  return { localize, formatDate }
}
