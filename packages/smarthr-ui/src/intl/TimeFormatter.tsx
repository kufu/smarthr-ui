'use client'

import dayjs from 'dayjs'
import { memo } from 'react'

import { useIntl } from './useIntl'

import type { FormatTimeProps } from './useIntl'

/**
 * 時刻を現在のロケールに応じてフォーマットして表示するコンポーネント
 * time要素でラップされ、ISO形式の日付文字列がdateTime属性に設定されます
 *
 * @param props - フォーマットのオプション
 * @param props.date - フォーマット対象の日付
 * @param props.parts - 表示する時刻のパーツ。指定しない場合は ['hour', 'minute'] がデフォルト
 * @param props.options - フォーマットオプション
 * @returns フォーマットされた時刻を含むtime要素
 * @example
 * // 基本的な使用法（ロケールのデフォルト形式）
 * <TimeFormatter date="2026-02-01T10:30:00+09:00" />
 * // <time datetime="2026-02-01T10:30:00+09:00">10:30</time>
 *
 * // 秒を含めて表示
 * <TimeFormatter date="2026-02-01T10:30:45+09:00" parts={['hour', 'minute', 'second']} />
 * // <time datetime="2026-02-01T10:30:45+09:00">10:30:45</time>
 *
 * // 時のみ表示
 * <TimeFormatter date="2026-02-01T10:30:00+09:00" parts={['hour']} />
 * // <time datetime="2026-02-01T10:30:00+09:00">10</time>
 *
 * // 12時間形式で表示
 * <TimeFormatter date="2026-02-01T10:30:00+09:00" options={{ hour12: true }} />
 * // <time datetime="2026-02-01T10:30:00+09:00">10:30 AM</time> (en-us)
 */
export const TimeFormatter = memo<Omit<FormatTimeProps, 'date'> & { date: string | Date }>(
  ({ date: orgDate, ...rest }) => {
    const date = dayjs(orgDate).toDate()
    const { formatTime } = useIntl()
    return <time dateTime={date.toISOString()}>{formatTime({ ...rest, date })}</time>
  },
)
