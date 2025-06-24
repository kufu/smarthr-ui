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

const DATE_FORMATS: Record<
  keyof typeof locales,
  Intl.DateTimeFormatOptions & { weekStartDay: number }
> = {
  // localeがja, ja-easyの場合、フォーマットを YYYY/MM/DD 形式にする
  // 参考: https://smarthr.design/products/contents/idiomatic-usage/count/#h2-3
  ja: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    weekStartDay: 0, // 日曜日開始
  },
  'ja-easy': {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    weekday: 'short',
    weekStartDay: 0, // 日曜日開始
  },
  'en-us': {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    weekday: 'short',
    weekStartDay: 0, // 日曜日開始
  },
  'id-id': {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    weekday: 'short',
    weekStartDay: 1, // 月曜日開始
  },
  ko: {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    weekday: 'short',
    weekStartDay: 0, // 日曜日開始
  },
  pt: {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    weekday: 'short',
    weekStartDay: 1, // 月曜日開始
  },
  vi: {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    weekday: 'short',
    weekStartDay: 1, // 月曜日開始
  },
  'zh-cn': {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    weekday: 'short',
    weekStartDay: 0, // 日曜日開始
  },
  'zh-tw': {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    weekday: 'short',
    weekStartDay: 0, // 日曜日開始
  },
} as const

const BRACKET_CONFIG = {
  ja: { pattern: /(.+?)\(([月火水木金土日])\)$/, template: '$1（$2）' },
  'ja-easy': { pattern: /(.+?)\(([月火水木金土日])\)$/, template: '$1（$2）' },
  'en-us': { pattern: /^([A-Za-z]{3}), (.+)$/, template: '$2 ($1)' },
  'id-id': { pattern: /^([A-Za-z]{3}), (.+)$/, template: '$2 ($1)' },
  ko: { pattern: /(.+?)([월화수목금토일])$/, template: '$1（$2）' },
  pt: { pattern: /^([A-Za-z]{3}\.), (.+)$/, template: '$2 ($1)' },
  vi: { pattern: /^([A-Za-z]{2} \d+), (.+)$/, template: '$2 ($1)' },
  'zh-cn': { pattern: /(.+?)\s*([周][一二三四五六日])$/, template: '$1（$2）' },
  'zh-tw': { pattern: /(.+?)\s*([週][一二三四五六日])$/, template: '$1（$2）' },
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
   * formatDate({ date: new Date() }) // "2024/01/15（水）" (ja)
   *
   * // 特定のフィールドのみ表示
   * formatDate({ date: new Date(), fields: ['year', 'month'] }) // "2024/01" (ja)
   * formatDate({ date: new Date(), fields: ['weekday'] }) // "月" (ja)
   *
   * // 日本語でスラッシュを無効化（月を長形式で表示）
   * formatDate({ date: new Date(), fields: ['year', 'month'], options: { disableSlashInJa: true } }) // "2024年1月" (ja)
   *
   * // 最初の文字を大文字化
   * formatDate({ date: new Date(), fields: ['weekday'], options: { capitalizeFirstLetter: true } }) // "Seg." (pt)（指定しなければ "seg."）
   *
   * @returns フォーマットされた日付文字列
   */
  const formatDate = useCallback(
    ({
      date,
      fields,
      options,
    }: {
      date: Date
      fields?: Array<'year' | 'month' | 'day' | 'weekday'>
      options?: Intl.DateTimeFormatOptions & {
        disableSlashInJa?: boolean
        capitalizeFirstLetter?: boolean
      }
    }): string => {
      const {
        disableSlashInJa = false,
        capitalizeFirstLetter = false,
        ...formatOptions
      } = options || {}
      const requestedFields = fields || []

      // 指定されたフィールドが含まれているかチェック（指定がない場合は全て含まれる）
      const hasField = (field: 'year' | 'month' | 'day' | 'weekday') =>
        requestedFields.length === 0 || requestedFields.includes(field)

      // ロケールのデフォルト形式を取得
      const finalFormatOptions: Intl.DateTimeFormatOptions = {
        year: hasField('year') ? DATE_FORMATS[locale].year : undefined,
        month: hasField('month') ? DATE_FORMATS[locale].month : undefined,
        day: hasField('day') ? DATE_FORMATS[locale].day : undefined,
        weekday: hasField('weekday') ? DATE_FORMATS[locale].weekday : undefined,
        ...formatOptions,
      }

      // 日本語でスラッシュを無効化する場合
      if (disableSlashInJa && hasField('month') && locale === 'ja') {
        finalFormatOptions.month = 'long'
      }

      const result = intl.formatDate(date, finalFormatOptions)

      // 曜日をロケールに応じてフォーマットする
      let formattedResult = result
      const config = BRACKET_CONFIG[locale as keyof typeof BRACKET_CONFIG]
      if (
        config &&
        hasField('weekday') &&
        !(requestedFields.length === 1 && requestedFields[0] === 'weekday')
      ) {
        // 正規表現とテンプレートを適用
        const match = result.match(config.pattern)
        if (match) {
          formattedResult = result.replace(config.pattern, config.template)
        }
      }

      return capitalizeFirstLetter
        ? formattedResult.charAt(0).toUpperCase() + formattedResult.slice(1)
        : formattedResult
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
  const getWeekStartDay = (): number => DATE_FORMATS[locale].weekStartDay

  return { availableLocales, localize, formatDate, locale, getWeekStartDay }
}
