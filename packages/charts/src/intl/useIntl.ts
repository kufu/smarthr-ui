/*
 * packages/smarthr-ui/src/intl/ の useIntl.ts / IntlProvider.tsx を元にしたファイル
 */
'use client'

import { useContext, useMemo } from 'react'
import {
  IntlContext,
  type IntlShape,
  type PrimitiveType,
  ReactIntlErrorCode,
  type MessageDescriptor as ReactIntlMessageDescriptor,
  createIntl,
  createIntlCache,
} from 'react-intl'

import { locales, type typedJa } from './locales'

type Messages = Record<keyof typeof typedJa, string>

type MessageDescriptor<T extends keyof Messages> = Omit<ReactIntlMessageDescriptor, 'id'> & {
  id: T
  defaultText: (typeof typedJa)[T]
}

/**
 * useIntlフックの戻り値の型定義
 */
export type UseIntlReturn = {
  /** メッセージのローカライズ関数 */
  localize: <T extends keyof Messages>(
    descriptor: MessageDescriptor<T>,
    values?: Record<string, PrimitiveType>,
  ) => string
  /** 現在のロケール */
  locale: keyof typeof locales
}

const isValidLocale = (locale: string): locale is keyof typeof locales => locale in locales

// ICUのパース結果はcreateIntlの呼び出し間で共有したいため、モジュールスコープに持つ
const cache = createIntlCache()

export const getIntl = (
  locale: keyof typeof locales,
  externalMessages?: IntlShape['messages'],
): IntlShape =>
  createIntl(
    {
      locale,
      defaultLocale: 'ja',
      messages: { ...externalMessages, ...locales[locale] },
      onError: (error) => {
        if (error.code !== ReactIntlErrorCode.MISSING_TRANSLATION) {
          console.error(error)
        }
      },
    },
    cache,
  )

/**
 * メッセージローカライズ機能を提供するフック
 * react-intlをベースにした国際化機能を提供します
 *
 * @returns {UseIntlReturn} ローカライズに関連する関数とプロパティを含むオブジェクト
 * @example
 * const Component = () => {
 *   const { localize } = useIntl()
 *   return <span>{localize({ id: 'smarthr-ui-charts/DoughnutChart/ariaLabel', defaultText: 'ドーナツグラフ {segmentCount}個の項目' }, { segmentCount: 3 })}</span>
 * }
 */
export const useIntl = (): UseIntlReturn => {
  const intl = useContext(IntlContext) as IntlShape | null

  const result = useMemo(() => {
    const locale = intl && isValidLocale(intl.locale) ? intl.locale : 'ja'
    const chartsIntl = getIntl(locale, intl?.messages)

    return {
      localize: <T extends keyof Messages>(
        descriptor: MessageDescriptor<T>,
        values?: Record<string, PrimitiveType>,
      ): string =>
        chartsIntl.formatMessage({ ...descriptor, defaultMessage: descriptor.defaultText }, values),
      locale,
    }
  }, [intl])

  return result
}
