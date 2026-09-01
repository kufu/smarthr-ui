/*
 * packages/smarthr-ui/src/intl/useIntl.ts をコピーしたファイル
 * chartsの辞書はsmarthr-uiのIntlProviderのmessagesに含まれないため、次の2点のみ異なる
 * - charts専用のIntlShapeを生成し、そのformatMessageを利用している
 * - intl-messageformatに依存していないため、localizeのvaluesとoptsの型を簡略化している
 */
'use client'

import { useMemo } from 'react'
import {
  type IntlShape,
  type PrimitiveType,
  ReactIntlErrorCode,
  type MessageDescriptor as ReactIntlMessageDescriptor,
  createIntl,
  createIntlCache,
  useIntl as useReactIntl,
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

const cache = createIntlCache()
const intlMap = new Map<keyof typeof locales, IntlShape>()

export const getIntl = (locale: keyof typeof locales): IntlShape => {
  const cached = intlMap.get(locale)

  if (cached) {
    return cached
  }

  const intl = createIntl(
    {
      locale,
      defaultLocale: 'ja',
      messages: locales[locale],
      onError: (error) => {
        if (error.code !== ReactIntlErrorCode.MISSING_TRANSLATION) {
          console.error(error)
        }
      },
    },
    cache,
  )

  intlMap.set(locale, intl)

  return intl
}

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
  const intl = useReactIntl()

  const result = useMemo(() => {
    const locale = isValidLocale(intl.locale) ? intl.locale : 'ja'
    const chartsIntl = getIntl(locale)

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
