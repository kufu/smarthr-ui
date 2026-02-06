'use client'

import dayjs from 'dayjs'

import { useIntl } from './useIntl'

import type { FormatTimestampProps } from './useIntl'

/**
 * タイムスタンプ（日付＋時刻）を現在のロケールに応じてフォーマットして表示するコンポーネント
 * time要素でラップされ、ISO形式の日付文字列がdateTime属性に設定されます
 * 日付はスラッシュ形式、時刻は24時間形式で表示されます
 *
 * @param props - フォーマットのオプション
 * @param props.date - フォーマット対象の日付
 * @param props.timeParts - 表示する時刻のパーツ。指定しない場合は ['hour', 'minute'] がデフォルト
 * @returns フォーマットされたタイムスタンプを含むtime要素
 * @example
 * // 基本的な使用法
 * <TimestampFormatter date={new Date()} />
 * // <time datetime="2024-01-15T10:30:00.000Z">2024/01/15 10:30</time>
 *
 * // 秒を含めて表示
 * <TimestampFormatter date={new Date()} timeParts={['hour', 'minute', 'second']} />
 * // <time datetime="2024-01-15T10:30:45.000Z">2024/01/15 10:30:45</time>
 */
export const TimestampFormatter = ({
  date: orgDate,
  ...rest
}: Omit<FormatTimestampProps, 'date'> & {
  date: string | Date
}) => {
  const date = dayjs(orgDate).toDate()
  const { formatTimestamp } = useIntl()
  return <time dateTime={date.toISOString()}>{formatTimestamp({ ...rest, date })}</time>
}
