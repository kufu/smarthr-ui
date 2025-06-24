'use client'

import { useCallback } from 'react'
import {
  type PrimitiveType,
  type MessageDescriptor as ReactIntlMessageDescriptor,
  useIntl as useReactIntl,
} from 'react-intl'

import { useAvailableLocales } from './IntlProvider'
import * as locales from './locales'

import type { FormatXMLElementFn, Options as IntlMessageFormatOptions } from 'intl-messageformat'

type Messages = Record<keyof typeof locales.ja, string>

type MessageDescriptor<T extends keyof Messages> = Omit<ReactIntlMessageDescriptor, 'id'> & {
  id: T
  defaultText: (typeof locales.ja)[T]
}

const DATE_FORMATS: Record<keyof typeof locales, Intl.DateTimeFormatOptions> = {
  // localeがja, ja-easyの場合、フォーマットを YYYY/MM/DD 形式にする
  // 参考: https://smarthr.design/products/contents/idiomatic-usage/count/#h2-3
  ja: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  },
  'ja-easy': {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    weekday: 'short',
  },
  'en-us': {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    weekday: 'short',
  },
  'id-id': {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    weekday: 'short',
  },
  ko: {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    weekday: 'short',
  },
  pt: {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    weekday: 'short',
  },
  vi: {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    weekday: 'short',
  },
  'zh-cn': {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    weekday: 'short',
  },
  'zh-tw': {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    weekday: 'short',
  },
} as const

const isValidLocale = (locale: string): locale is keyof typeof locales => locale in locales

export const useIntl = () => {
  const intl = useReactIntl()
  const locale = isValidLocale(intl.locale) ? intl.locale : 'ja'
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

  /**
   * 日付をロケールに応じた形式でフォーマットする関数
   *
   * @param date - フォーマット対象の日付
   * @param fields - 表示するフィールド。指定しない場合は全て表示
   * @param options - フォーマットオプション
   *
   * @example
   * // 基本的な使用法（ロケールのデフォルト形式）
   * formatDate(new Date()) // "2024/01/15" (ja)
   *
   * // 特定のフィールドのみ表示
   * formatDate(new Date(), ['year', 'month']) // "2024/01" (ja)
   * formatDate(new Date(), ['weekday']) // "月" (ja)
   *
   * // 日本語でスラッシュを無効化（月を長形式で表示）
   * formatDate(new Date(), ['year', 'month'], { disableSlashInJa: true }) // "2024年1月" (ja)
   *
   * // 最初の文字を大文字化
   * formatDate(new Date(), ['weekday'], { capitalize: true }) // "月" (ja)
   *
   * @returns フォーマットされた日付文字列
   */
  const formatDate = useCallback(
    (
      date: Date,
      fields?: Array<'year' | 'month' | 'day' | 'weekday'>,
      options?: { disableSlashInJa?: boolean; capitalize?: boolean },
    ): string => {
      const { disableSlashInJa = false, capitalize = false } = options || {}
      const requestedFields = fields || []

      // 指定されたフィールドが含まれているかチェック（指定がない場合は全て含まれる）
      const hasField = (field: 'year' | 'month' | 'day' | 'weekday') =>
        requestedFields.length === 0 || requestedFields.includes(field)

      // ロケールのデフォルト形式を取得
      const formatOptions: Intl.DateTimeFormatOptions = {
        year: hasField('year') ? DATE_FORMATS[locale].year : undefined,
        month: hasField('month') ? DATE_FORMATS[locale].month : undefined,
        day: hasField('day') ? DATE_FORMATS[locale].day : undefined,
        weekday: hasField('weekday') ? DATE_FORMATS[locale].weekday : undefined,
      }

      // 日本語でスラッシュを無効化する場合
      if (disableSlashInJa && hasField('month') && locale === 'ja') {
        formatOptions.month = 'long'
      }

      const result = intl.formatDate(date, formatOptions)
      return capitalize ? result.charAt(0).toUpperCase() + result.slice(1) : result
    },
    [intl, locale],
  )

  /**
   * 現在のロケールに基づいて週の開始日を決定する関数
   * Intl.Locale.prototype.getWeekInfo()の動作を再現
   * getWeekInfo()を使わない理由は、Firefoxでは動作しないため
   *
   * @returns 週の開始日（0 = 日曜日, 1 = 月曜日, ..., 6 = 土曜日）
   *
   * @example
   * const { getWeekStartDay } = useIntl()
   * getWeekStartDay() // 0 (日曜日開始) for 'en-us', 1 (月曜日開始) for 'id-id'
   */
  const getWeekStartDay = (): number => {
    const weekStartMap: Partial<Record<keyof typeof locales, number>> = {
      // 日曜日開始
      'en-us': 0,
      ja: 0,
      'ja-easy': 0,
      ko: 0,
      'zh-cn': 0,
      'zh-tw': 0,
      // その他の曜日開始も拡張可能
    }

    return weekStartMap[locale] ?? 1 // デフォルトは月曜日開始
  }

  return { availableLocales, localize, formatDate, locale, getWeekStartDay }
}
