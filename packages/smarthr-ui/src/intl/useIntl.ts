'use client'

import { useCallback } from 'react'
import {
  type PrimitiveType,
  type MessageDescriptor as ReactIntlMessageDescriptor,
  useIntl as useReactIntl,
} from 'react-intl'

import { useAvailableLocales } from './IntlProvider'
import { locales, type typedJa } from './locales'

import type { FormatXMLElementFn, Options as IntlMessageFormatOptions } from 'intl-messageformat'

type Messages = Record<keyof typeof typedJa, string>

type MessageDescriptor<T extends keyof Messages> = Omit<ReactIntlMessageDescriptor, 'id'> & {
  id: T
  defaultText: (typeof typedJa)[T]
}

/**
 * useIntlフックの戻り値の型定義
 */
export type UseIntlReturn = {
  /** 利用可能なロケールのリスト */
  availableLocales: string[]
  /** メッセージのローカライズ関数 */
  localize: <T extends keyof Messages>(
    descriptor: MessageDescriptor<T>,
    values?: Record<string, PrimitiveType | FormatXMLElementFn<string, string>>,
    opts?: IntlMessageFormatOptions,
  ) => string
  /** 現在のロケール */
  locale: keyof typeof locales
}

const isValidLocale = (locale: string): locale is keyof typeof locales => locale in locales

/**
 * メッセージローカライズ機能を提供するフック
 * react-intlをベースにした国際化機能を提供します
 *
 * @returns {UseIntlReturn} ローカライズに関連する関数とプロパティを含むオブジェクト
 * @example
 * // 基本的な使用法（メッセージのローカライズ）
 * const Component = () => {
 *   const { localize } = useIntl()
 *   return <span>{localize({ id: 'smarthr-ui/common/language', defaultText: '日本語' })}</span>
 * }
 *
 * @example
 * // 利用可能なロケールの確認
 * const Component = () => {
 *   const { availableLocales, locale } = useIntl()
 *   return <div>現在のロケール: {locale}</div>
 * }
 */
export const useIntl = (): UseIntlReturn => {
  const intl = useReactIntl()
  const availableLocales = useAvailableLocales()

  const localize = useCallback(
    <T extends keyof Messages>(
      descriptor: MessageDescriptor<T>,
      values?: Record<string, PrimitiveType | FormatXMLElementFn<string, string>>,
      opts?: IntlMessageFormatOptions,
    ): string =>
      intl.formatMessage({ ...descriptor, defaultMessage: descriptor.defaultText }, values, opts),
    [intl],
  )

  return {
    availableLocales,
    localize,
    locale: isValidLocale(intl.locale) ? intl.locale : 'ja',
  }
}
