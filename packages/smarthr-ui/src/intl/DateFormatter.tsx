'use client'

import { useIntl } from './useIntl'

import type { FormatDateProps } from './useIntl'

/**
 * 日付を現在のロケールに応じてフォーマットして表示するコンポーネント
 * time要素でラップされ、ISO形式の日付文字列がdateTime属性に設定されます
 *
 * @param props - フォーマットのオプション
 * @param props.date - フォーマット対象の日付
 * @param props.parts - 表示する日付のパーツ。指定しない場合は全て表示
 * @param props.options - フォーマットオプション
 * @param props.options.disableSlashInJa - 日本語ロケールでスラッシュを無効化し、月を長形式で表示する
 * @param props.options.capitalizeFirstLetter - 最初の文字を大文字化する
 * @returns フォーマットされた日付を含むtime要素
 * @example
 * // 基本的な使用法（ロケールのデフォルト形式）
 * <DateFormatter date={new Date()} />
 * // <time datetime="2024-01-15T10:30:00.000Z">2024/01/15</time>
 *
 * // 日付を曜日ありで表示
 * <DateFormatter date={new Date()} parts={['year', 'month', 'day', 'weekday']} />
 * // <time datetime="2024-01-15T10:30:00.000Z">2024/01/15（水）</time>
 *
 * // 特定のパーツのみ表示
 * <DateFormatter
 *   date={new Date()}
 *   parts={['year', 'month']}
 * />
 * // <time datetime="2024-01-15T10:30:00.000Z">2024/01</time>
 *
 * // 日本語でスラッシュを無効化（月を長形式で表示）
 * <DateFormatter
 *   date={new Date()}
 *   parts={['year', 'month']}
 *   options={{ disableSlashInJa: true }}
 * />
 * // <time datetime="2024-01-15T10:30:00.000Z">2024年1月</time>
 *
 * // 最初の文字を大文字化
 * <DateFormatter
 *   date={new Date()}
 *   parts={['weekday']}
 *   options={{ capitalizeFirstLetter: true }}
 * />
 * // <time datetime="2024-01-15T10:30:00.000Z">Seg.</time> (pt)（指定しなければ "seg."）
 */
export const DateFormatter = ({ date, parts, options }: FormatDateProps) => {
  const { formatDate } = useIntl()
  return <time dateTime={date.toISOString()}>{formatDate({ date, parts, options })}</time>
}
