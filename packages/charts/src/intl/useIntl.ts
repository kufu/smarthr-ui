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

// react-intlのIntlProviderを直接使うプロダクトからは任意の文字列が来るため、
// inだと'toString'などプロトタイプ上のキーも通ってしまう
const isValidLocale = (locale: string): locale is keyof typeof locales =>
  Object.prototype.hasOwnProperty.call(locales, locale)

// ICUのパース結果はcreateIntlの呼び出し間で共有したいため、モジュールスコープに持つ
const cache = createIntlCache()
// チャートごとにformatterを組み立てないよう、locale単位で使い回す
const formatters = new Map<keyof typeof locales, IntlShape>()

// chartsのformatterは自身のlocalizeでしか使わず子に渡さないため、プロダクト側のmessagesは混ぜない。
// 混ぜると辞書が空のロケールでだけプロダクト側の同名キーが優先され、ロケールで挙動が変わってしまう。
// chartsはIntlProviderを描画しないので、childrenに渡されたコンポーネントは外側のProviderの辞書をそのまま引ける。
// charts自前のProviderでchildrenを包む構造に変える場合は、children向けにプロダクト側のmessagesを混ぜる必要がある
export const getIntl = (locale: keyof typeof locales): IntlShape => {
  const cached = formatters.get(locale)

  if (cached) {
    return cached
  }

  const formatter = createIntl(
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

  formatters.set(locale, formatter)

  return formatter
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
  const intl = useContext(IntlContext) as IntlShape | null
  const locale = intl && isValidLocale(intl.locale) ? intl.locale : 'ja'

  const result = useMemo(() => {
    const chartsIntl = getIntl(locale)

    return {
      localize: <T extends keyof Messages>(
        descriptor: MessageDescriptor<T>,
        values?: Record<string, PrimitiveType>,
      ): string =>
        chartsIntl.formatMessage({ ...descriptor, defaultMessage: descriptor.defaultText }, values),
      locale,
    }
  }, [locale])

  return result
}
