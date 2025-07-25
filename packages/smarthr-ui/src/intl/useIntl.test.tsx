import { renderHook } from '@testing-library/react'
import { IntlProvider as ReactIntlProvider, useIntl as useReactIntl } from 'react-intl'

import { IntlProvider, locales, useIntl } from '.'

import type { FC, PropsWithChildren } from 'react'

describe('useIntl', () => {
  it('returns all messages even if provider is nested', async () => {
    const wrapper: FC<PropsWithChildren> = ({ children }) => (
      <ReactIntlProvider locale="ja" messages={{ test: 'テスト' }}>
        <IntlProvider locale="ja">{children}</IntlProvider>
      </ReactIntlProvider>
    )
    const { localize } = renderHook(() => useIntl(), { wrapper }).result.current
    expect(localize({ id: 'smarthr-ui/common/language', defaultText: '日本語' })).toBe('日本語')
    const { formatMessage } = renderHook(() => useReactIntl(), { wrapper }).result.current
    expect(formatMessage({ id: 'test' })).toBe('テスト')
  })

  it('returns narrowed availableLocales', async () => {
    const wrapper: FC<PropsWithChildren> = ({ children }) => (
      <IntlProvider locale="ja" availableLocales={['ja', 'en-us']}>
        {children}
      </IntlProvider>
    )
    const { availableLocales } = renderHook(() => useIntl(), { wrapper }).result.current
    expect(availableLocales).toEqual(['ja', 'en-us'])
  })

  it('returns all locales as availableLocales when not narrowed', async () => {
    const wrapper: FC<PropsWithChildren> = ({ children }) => (
      <IntlProvider locale="ja">{children}</IntlProvider>
    )
    const { availableLocales } = renderHook(() => useIntl(), { wrapper }).result.current
    expect(availableLocales).toEqual(Object.keys(locales))
  })

  it('returns the correct locale', () => {
    const wrapper: FC<PropsWithChildren> = ({ children }) => (
      <IntlProvider locale="en-us">{children}</IntlProvider>
    )
    const { locale } = renderHook(() => useIntl(), { wrapper }).result.current
    expect(locale).toBe('en-us')
  })

  it('returns different locales correctly', () => {
    const wrapper: FC<PropsWithChildren> = ({ children }) => (
      <IntlProvider locale="ja-easy">{children}</IntlProvider>
    )
    const { locale } = renderHook(() => useIntl(), { wrapper }).result.current
    expect(locale).toBe('ja-easy')
  })

  describe('formatDate', () => {
    const testDate = new Date(2025, 1 - 1, 1) // 2025年1月1日
    const fullParts = ['year', 'month', 'day', 'weekday'] as const

    describe('locale variations with default parts (no weekday)', () => {
      it('formats date in ja locale', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="ja">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate({ date: testDate })).toBe('2025/01/01')
      })
    })

    describe('locale variations with full parts', () => {
      it('formats date in ja locale', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="ja">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate({ date: testDate, parts: fullParts })).toBe('2025/01/01（水）')
      })

      it('formats date in en-us locale', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="en-us">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate({ date: testDate, parts: fullParts })).toBe('Jan 01, 2025 (Wed)')
      })

      it('formats date in ja-easy locale', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="ja-easy">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate({ date: testDate, parts: fullParts })).toBe('2025年1月01日（水）')
      })

      it('formats date in id-id locale', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="id-id">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate({ date: testDate, parts: fullParts })).toBe('01 Jan 2025 (Rab)')
      })

      it('formats date in ko locale', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="ko">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate({ date: testDate, parts: fullParts })).toBe('2025년 1월 1일  (수)')
      })

      it('formats date in pt locale', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="pt">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate({ date: testDate, parts: fullParts })).toBe('01 de jan. de 2025 (qua.)')
      })

      it('formats date in vi locale', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="vi">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate({ date: testDate, parts: fullParts })).toBe('01 tháng 1, 2025 (Th 4)')
      })

      it('formats date in zh-cn locale', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="zh-cn">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate({ date: testDate, parts: fullParts })).toBe('2025年1月1日（周三）')
      })

      it('formats date in zh-tw locale', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="zh-tw">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate({ date: testDate, parts: fullParts })).toBe('2025年1月1日（週三）')
      })
    })

    describe('part combinations', () => {
      it('formats only year and month', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="ja">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate({ date: testDate, parts: ['year', 'month'] })).toBe('2025/01')
      })

      it('formats only year', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="ja">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate({ date: testDate, parts: ['year'] })).toBe('2025年')
      })

      it('formats only month and day', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="ja">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate({ date: testDate, parts: ['month', 'day'] })).toBe('01/01')
      })

      it('formats only weekday', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="ja">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate({ date: testDate, parts: ['weekday'] })).toBe('水')
      })

      it('formats year, month, day, and weekday', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="ja">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate({ date: testDate, parts: ['year', 'month', 'day', 'weekday'] })).toBe(
          '2025/01/01（水）',
        )
      })
    })

    describe('options', () => {
      it('disables slash in ja locale with disableSlashInJa option', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="ja">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(
          formatDate({
            date: testDate,
            parts: ['year', 'month'],
            options: { disableSlashInJa: true },
          }),
        ).toBe('2025年1月')
      })

      it('capitalizes first character with capitalizeFirstLetter option', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="pt">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(
          formatDate({
            date: testDate,
            parts: ['weekday'],
            options: { capitalizeFirstLetter: true },
          }),
        ).not.toBe('qua.')
        expect(
          formatDate({
            date: testDate,
            parts: ['weekday'],
            options: { capitalizeFirstLetter: true },
          }),
        ).toBe('Qua.')
      })

      it('does not affect en-us locale with disableSlashInJa option', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="en-us">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(
          formatDate({
            date: testDate,
            parts: ['year', 'month'],
            options: { disableSlashInJa: true },
          }),
        ).toBe('Jan 2025')
      })

      it('handles undefined options', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="ja">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate({ date: testDate, parts: ['year', 'month'], options: undefined })).toBe(
          '2025/01',
        )
      })
    })

    describe('edge cases', () => {
      it('handles different dates correctly', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="ja">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current

        const date1 = new Date(2024, 11 - 1, 15) // 2024年11月15日
        expect(formatDate({ date: date1 })).toBe('2024/11/15')

        const date2 = new Date(2023, 6 - 1, 30) // 2023年6月30日
        expect(formatDate({ date: date2 })).toBe('2023/06/30')
      })

      it('does not add brackets for Chinese locales when only weekday is included', () => {
        // 簡体字をチェック
        const zhCnWrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="zh-cn">{children}</IntlProvider>
        )
        const { formatDate: formatDateZhCn } = renderHook(() => useIntl(), { wrapper: zhCnWrapper })
          .result.current

        expect(formatDateZhCn({ date: testDate, parts: ['weekday'] })).toBe('周三')

        // 簡体字をチェック
        const zhTwWrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="zh-tw">{children}</IntlProvider>
        )
        const { formatDate: formatDateZhTw } = renderHook(() => useIntl(), { wrapper: zhTwWrapper })
          .result.current
        expect(formatDateZhTw({ date: testDate, parts: ['weekday'] })).toBe('週三')
      })

      it('does not add brackets for English locale when only weekday is included', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="en-us">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate({ date: testDate, parts: ['weekday'] })).toBe('Wed')
      })
    })
  })

  describe('getWeekStartDay', () => {
    it('returns 0 (Sunday) for Sunday-start locales', () => {
      const sundayStartLocales = ['en-us', 'ja', 'ja-easy', 'ko', 'zh-cn', 'zh-tw'] as const

      sundayStartLocales.forEach((locale) => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale={locale}>{children}</IntlProvider>
        )
        const { getWeekStartDay } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(getWeekStartDay()).toBe(0)
      })
    })

    it('returns 1 (Monday) for Monday-start locales', () => {
      const mondayStartLocales = ['id-id', 'vi', 'pt'] as const

      mondayStartLocales.forEach((locale) => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale={locale}>{children}</IntlProvider>
        )
        const { getWeekStartDay } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(getWeekStartDay()).toBe(1)
      })
    })
  })
})
