import { FormatXMLElementFn, Options as IntlMessageFormatOptions } from 'intl-messageformat'
import { useCallback } from 'react'
import {
  PrimitiveType,
  MessageDescriptor as ReactIntlMessageDescriptor,
  useIntl as useReactIntl,
} from 'react-intl'

import { locale as ja } from '../locales/ja'
import { Messages } from '../locales/types'

/**
 * MEMO:
 * src/components/parts/FormattedMessage/FormattedMessage.tsx
 * と同じやり方で型を拡張している
 */
type MessageDescriptor<T extends keyof Messages> = Omit<ReactIntlMessageDescriptor, 'id'> & {
  id: T
  defaultMessage: (typeof ja)[T]
}

export const useIntl = () => {
  const intl = useReactIntl()
  // const lang = useLanguage()
  const lang = intl.locale

  const formatMessage = useCallback(
    <T extends keyof Messages>(
      descriptor: MessageDescriptor<T>,
      values?: Record<string, PrimitiveType | FormatXMLElementFn<string, string>>,
      opts?: IntlMessageFormatOptions,
    ): string => intl.formatMessage(descriptor, values, opts),
    [intl],
  )

  const formatDate = useCallback(
    (date: Date, opts?: Intl.DateTimeFormatOptions & { jaFormat?: boolean }): string => {
      // 日本語の場合デザインシステム上のフォーマットは「YYYY/MM/DD」形式なので、それに合わせるための対応
      const slashFormat = !opts?.jaFormat && lang === 'ja'

      const overrideOpts: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: slashFormat ? '2-digit' : 'short',
        day: '2-digit',
        ...opts,
      } as const

      return intl.formatDate(date, overrideOpts)
    },
    [intl, lang],
  )

  return { formatMessage, formatDate }
}
