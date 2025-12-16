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

type DatePart = 'year' | 'month' | 'day' | 'weekday'

type TimePart = 'hour' | 'minute' | 'second'

export type FormatDateProps = {
  /**
   * フォーマット対象の日付
   */
  date: Date

  /**
   * 表示する日付のパーツ。指定しない場合は全て表示
   */
  parts?: readonly [DatePart, ...DatePart[]]

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

export type FormatTimeProps = {
  /**
   * フォーマット対象の日付
   */
  date: Date

  /**
   * 表示する時刻のパーツ。指定しない場合は ['hour', 'minute'] がデフォルト
   */
  parts?: readonly [TimePart, ...TimePart[]]

  /**
   * フォーマットオプション
   */
  options?: Intl.DateTimeFormatOptions
}

export type FormatTimestampProps = {
  /**
   * フォーマット対象の日付
   */
  date: Date

  /**
   * 表示する時刻のパーツ。指定しない場合は ['hour', 'minute'] がデフォルト
   */
  timeParts?: readonly [TimePart, ...TimePart[]]
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

  /**
   * 日付をロケールに応じた形式でフォーマットする関数
   * @param props - フォーマットのオプション
   * @param props.date - フォーマット対象の日付
   * @param props.parts - 表示する日付のパーツ。デフォルトは ['year', 'month', 'day', 'weekday']
   * @param props.options - フォーマットオプション
   * @param props.options.disableSlashInJa - 日本語ロケールでスラッシュを無効化し、月を長形式で表示する
   * @param props.options.capitalizeFirstLetter - 最初の文字を大文字化する
   * @returns フォーマットされた日付文字列
   * @example
   * // 基本的な使用法（ロケールのデフォルト形式：曜日なし）
   * formatDate({ date: new Date() }) // "2024/01/15" (ja)
   *
   * // 日付を曜日ありで表示
   * formatDate({ date: new Date(), parts: ['year', 'month', 'day', 'weekday'] }) // "2024/01/15（水）" (ja)
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
   * 時刻をロケールに応じた形式でフォーマットする関数
   * @param props - フォーマットのオプション
   * @param props.date - フォーマット対象の日付
   * @param props.parts - 表示する時刻のパーツ。デフォルトは ['hour', 'minute']
   * @param props.options - フォーマットオプション
   * @returns フォーマットされた時刻文字列
   * @example
   * // 基本的な使用法（ロケールのデフォルト形式）
   * formatTime({ date: new Date() }) // "10:30" (ja)
   *
   * // 秒を含めて表示
   * formatTime({ date: new Date(), parts: ['hour', 'minute', 'second'] }) // "10:30:45" (ja)
   *
   * // 時のみ表示
   * formatTime({ date: new Date(), parts: ['hour'] }) // "10" (ja)
   *
   * // 12時間形式で表示
   * formatTime({ date: new Date(), options: { hour12: true } }) // "午前10:30" (ja)
   */
  formatTime(props: FormatTimeProps): string

  /**
   * タイムスタンプ（日付＋時刻）をフォーマットする関数
   * 日付はスラッシュ形式、時刻は24時間形式で表示されます
   * @param props - フォーマットのオプション
   * @param props.date - フォーマット対象の日付
   * @param props.timeParts - 表示する時刻のパーツ。デフォルトは ['hour', 'minute']
   * @returns フォーマットされたタイムスタンプ文字列
   * @example
   * // 基本的な使用法
   * formatTimestamp({ date: new Date() }) // "2024/01/15 10:30" (ja)
   *
   * // 秒を含めて表示
   * formatTimestamp({ date: new Date(), timeParts: ['hour', 'minute', 'second'] }) // "2024/01/15 10:30:45" (ja)
   */
  formatTimestamp(props: FormatTimestampProps): string

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

const WEEK_START_DAYS = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
} as const

const DATE_FORMATS: Record<
  keyof typeof locales,
  Intl.DateTimeFormatOptions & { weekStartDay: number }
> = {
  // localeがja, ja-easyの場合、フォーマットを YYYY/MM/DD 形式にする
  // 曜日が含まれている場合は括弧を追加する
  // 参考: https://smarthr.design/products/contents/idiomatic-usage/count/#h2-3
  ja: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    weekStartDay: WEEK_START_DAYS.SUNDAY,
  },
  'ja-easy': {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    weekday: 'short',
    weekStartDay: WEEK_START_DAYS.SUNDAY,
  },
  'en-us': {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    weekday: 'short',
    weekStartDay: WEEK_START_DAYS.SUNDAY,
  },
  'id-id': {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    weekday: 'short',
    weekStartDay: WEEK_START_DAYS.MONDAY,
  },
  ko: {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    weekStartDay: WEEK_START_DAYS.SUNDAY,
  },
  pt: {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    weekday: 'short',
    weekStartDay: WEEK_START_DAYS.MONDAY,
  },
  vi: {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    weekday: 'short',
    weekStartDay: WEEK_START_DAYS.MONDAY,
  },
  'zh-cn': {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    weekStartDay: WEEK_START_DAYS.SUNDAY,
  },
  'zh-tw': {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    weekStartDay: WEEK_START_DAYS.SUNDAY,
  },
} as const

/**
 * 各ロケールの括弧設定マップ
 * ロケールに応じて適切な括弧スタイル（半角/全角）と配置を定義
 */
const WEEKDAY_FORMATS: Record<keyof typeof locales, { replacer: (base: string) => string }> = {
  ja: { replacer: (base) => base.replace(/(.+?)\(([月火水木金土日])\)$/, '$1（$2）') },
  'ja-easy': { replacer: (base) => base.replace(/(.+?)\(([月火水木金土日])\)$/, '$1（$2）') },
  'en-us': { replacer: (base) => base.replace(/^([A-Za-z]{3}), (.+)$/, '$2 ($1)') },
  'id-id': { replacer: (base) => base.replace(/^([A-Za-z]{3}), (.+)$/, '$2 ($1)') },
  ko: { replacer: (base) => base.replace(/(.+?)([월화수목금토일])$/, '$1 ($2)') },
  pt: { replacer: (base) => base.replace(/^([A-Za-z]{3}\.), (.+)$/, '$2 ($1)') },
  vi: { replacer: (base) => base.replace(/^([A-Za-z]{2} \d+), (.+)$/, '$2 ($1)') },
  'zh-cn': { replacer: (base) => base.replace(/(.+?)\s*([周][一二三四五六日])$/, '$1（$2）') },
  'zh-tw': { replacer: (base) => base.replace(/(.+?)\s*([週][一二三四五六日])$/, '$1（$2）') },
} as const

const TIME_FORMATS: Record<keyof typeof locales, Intl.DateTimeFormatOptions> = {
  ja: {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  },
  'ja-easy': {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  },
  'en-us': {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  },
  'id-id': {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  },
  ko: {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  },
  pt: {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  },
  vi: {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  },
  'zh-cn': {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  },
  'zh-tw': {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  },
} as const

const isValidLocale = (locale: string): locale is keyof typeof locales => locale in locales

const applyCapitalization = (text: string, shouldCapitalize: boolean) =>
  shouldCapitalize ? text.charAt(0).toUpperCase() + text.slice(1) : text

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
 *   return <span>{formatDate({ date: new Date(2024, 1 - 1, 15) })}</span> // "2024/01/15" (ja)
 * }
 *
 * @example
 * // 時刻のフォーマット
 * const Component = () => {
 *   const { formatTime } = useIntl()
 *   return <span>{formatTime({ date: new Date(2024, 1 - 1, 15, 10, 30, 0) })}</span> // "10:30" (ja)
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
    ({ date, parts = ['year', 'month', 'day'], options }: FormatDateProps): string => {
      const {
        disableSlashInJa = false,
        capitalizeFirstLetter = false,
        ...formatOptions
      } = options || {}

      // パーツの存在を事前に計算
      const hasPart = parts.reduce(
        (prev, part) => {
          prev[part] = true
          return prev
        },
        { year: false, month: false, day: false, weekday: false } as {
          year: boolean
          month: boolean
          day: boolean
          weekday: boolean
        },
      )

      // ロケールのデフォルト形式を取得
      const actualFormatOptions: Intl.DateTimeFormatOptions = {
        year: hasPart.year ? DATE_FORMATS[locale].year : undefined,
        month: hasPart.month
          ? disableSlashInJa && locale === 'ja'
            ? 'long'
            : DATE_FORMATS[locale].month
          : undefined,
        day: hasPart.day ? DATE_FORMATS[locale].day : undefined,
        weekday: hasPart.weekday ? DATE_FORMATS[locale].weekday : undefined,
        ...formatOptions,
      }

      const formattedDate = intl.formatDate(date, actualFormatOptions)

      // 曜日をロケールに応じてフォーマットする
      let formattedResult = formattedDate
      const config = WEEKDAY_FORMATS[locale]
      // 曜日が含まれており、かつ曜日のみの表示でない場合は括弧を追加
      // 例: "2025/01/01（水）" → 括弧あり, "水" → 括弧なし
      if (config && hasPart.weekday && (parts.length !== 1 || parts[0] !== 'weekday')) {
        formattedResult = config.replacer(formattedDate)
      }

      return applyCapitalization(formattedResult, capitalizeFirstLetter)
    },
    [intl, locale],
  )

  const formatTime = useCallback(
    ({ date, parts = ['hour', 'minute'], options }: FormatTimeProps): string => {
      const { ...formatOptions } = options || {}

      const hasPart = parts.reduce(
        (prev, part) => {
          prev[part] = true
          return prev
        },
        { hour: false, minute: false, second: false } as {
          hour: boolean
          minute: boolean
          second: boolean
        },
      )

      const actualFormatOptions: Intl.DateTimeFormatOptions = {
        hour: hasPart.hour ? TIME_FORMATS[locale].hour : undefined,
        minute: hasPart.minute ? TIME_FORMATS[locale].minute : undefined,
        second: hasPart.second ? '2-digit' : undefined,
        hour12:
          formatOptions.hour12 !== undefined ? formatOptions.hour12 : TIME_FORMATS[locale].hour12,
        ...formatOptions,
      }

      return intl.formatDate(date, actualFormatOptions)
    },
    [intl, locale],
  )

  const formatTimestamp = useCallback(
    ({ date, timeParts = ['hour', 'minute'] }: FormatTimestampProps): string => {
      const formattedDate = formatDate({ date, parts: ['year', 'month', 'day'] })
      const formattedTime = formatTime({ date, parts: timeParts })
      return `${formattedDate} ${formattedTime}`
    },
    [formatDate, formatTime],
  )

  const getWeekStartDay = (): number => DATE_FORMATS[locale].weekStartDay

  return {
    availableLocales,
    localize,
    formatDate,
    formatTime,
    formatTimestamp,
    locale,
    getWeekStartDay,
  }
}
