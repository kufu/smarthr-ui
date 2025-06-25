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

export type FormatDateProps = {
  /**
   * フォーマット対象の日付
   */
  date: Date

  /**
   * 表示する日付のパーツ。指定しない場合は全て表示
   */
  parts?: Array<'year' | 'month' | 'day' | 'weekday'>

  /**
   * フォーマットオプション
   */
  options?: Intl.DateTimeFormatOptions & {
    /**
     * 日本語ロケールでスラッシュを無効化し、月を長形式で表示する
     * @example
     * // 通常: "2025/01"
     * // disableSlashInJa: true の場合: "2025年1月"
     */
    disableSlashInJa?: boolean

    /**
     * 最初の文字を大文字化する
     * @example
     * // 通常: "seg." (pt)
     * // capitalizeFirstLetter: true の場合: "Seg." (pt)
     */
    capitalizeFirstLetter?: boolean
  }
}

type BracketConfig = {
  /**
   * 曜日を含む日付文字列にマッチする正規表現パターン
   */
  pattern: RegExp

  /**
   * 括弧付きの曜日表示に変換するためのテンプレート文字列
   * $1: 日付部分, $2: 曜日部分
   */
  template: string
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

/**
 * 各ロケールの括弧設定マップ
 * ロケールに応じて適切な括弧スタイル（半角/全角）と配置を定義
 */
const WEEKDAY_FORMATS: Record<keyof typeof locales, BracketConfig> = {
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
  /**
   * 日付をロケールに応じた形式でフォーマットする関数
   * @param props - フォーマットのオプション
   * @param props.date - フォーマット対象の日付
   * @param props.parts - 表示する日付のパーツ。指定しない場合は全て表示
   * @param props.options - フォーマットオプション
   * @returns フォーマットされた日付文字列
   * @example
   * // 基本的な使用法（ロケールのデフォルト形式）
   * formatDate({ date: new Date() }) // "2024/01/15（水）" (ja)
   *
   * // 特定のフィールドのみ表示
   * formatDate({ date: new Date(), parts: ['year', 'month'] }) // "2024/01" (ja)
   * formatDate({ date: new Date(), parts: ['weekday'] }) // "月" (ja)
   *
   * // 日本語でスラッシュを無効化（月を長形式で表示）
   * formatDate({ date: new Date(), parts: ['year', 'month'], options: { disableSlashInJa: true } }) // "2024年1月" (ja)
   *
   * // 最初の文字を大文字化
   * formatDate({ date: new Date(), parts: ['weekday'], options: { capitalizeFirstLetter: true } }) // "Seg." (pt)（指定しなければ "seg."）
   */
  formatDate(props: FormatDateProps): string
  /**
   * 現在のロケールに基づいて週の開始日を決定する関数
   * Intl.Locale.prototype.getWeekInfo()の動作を再現
   * getWeekInfo()を使わない理由は、Firefoxでは動作しないため
   *
   * @returns 週の開始日（0 = 日曜日, 1 = 月曜日, ..., 6 = 土曜日）
   */
  getWeekStartDay: () => number
  /** 現在のロケール */
  locale: keyof typeof locales
}

/**
 * 多言語化機能を提供するフック
 * react-intlをベースにした国際化機能を提供します
 *
 * @returns {UseIntlReturn} 国際化に関連する関数とプロパティを含むオブジェクト
 * @example
 * // 基本的な使用法（メッセージのローカライズ）
 * const Component = () => {
 *   const { localize } = useIntl()
 *   return <span>{localize({ id: 'smarthr-ui/common/language', defaultText: '日本語' })}</span>
 * }
 *
 * @example
 * // 日付のフォーマット
 * const Component = () => {
 *   const { formatDate } = useIntl()
 *   return <span>{formatDate({ date: new Date() })}</span> // "2024/01/15（水）" (ja)
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

  const formatDate = useCallback(
    (props: FormatDateProps): string => {
      const { date, parts, options } = props
      const {
        disableSlashInJa = false,
        capitalizeFirstLetter = false,
        ...formatOptions
      } = options || {}
      const requestedParts = parts || []

      // 指定されたパーツが含まれているかチェック（指定がない場合は全て含まれる）
      const hasPart = (part: 'year' | 'month' | 'day' | 'weekday') =>
        requestedParts.length === 0 || requestedParts.includes(part)

      // ロケールのデフォルト形式を取得
      const finalFormatOptions: Intl.DateTimeFormatOptions = {
        year: hasPart('year') ? DATE_FORMATS[locale].year : undefined,
        month: hasPart('month') ? DATE_FORMATS[locale].month : undefined,
        day: hasPart('day') ? DATE_FORMATS[locale].day : undefined,
        weekday: hasPart('weekday') ? DATE_FORMATS[locale].weekday : undefined,
        ...formatOptions,
      }

      // 日本語でスラッシュを無効化する場合
      if (disableSlashInJa && hasPart('month') && locale === 'ja') {
        finalFormatOptions.month = 'long'
      }

      const result = intl.formatDate(date, finalFormatOptions)

      // 曜日をロケールに応じてフォーマットする
      let formattedResult = result
      const config = WEEKDAY_FORMATS[locale]
      if (
        config &&
        hasPart('weekday') &&
        !(requestedParts.length === 1 && requestedParts[0] === 'weekday')
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

  const getWeekStartDay = (): number => DATE_FORMATS[locale].weekStartDay

  return { availableLocales, localize, formatDate, locale, getWeekStartDay }
}
