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

    describe('locale variations', () => {
      it('formats date in ja locale', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="ja">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate(testDate)).toBe('2025/01/01(水)')
      })

      it('formats date in en-us locale', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="en-us">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate(testDate)).toBe('Wed, Jan 01, 2025')
      })

      it('formats date in ja-easy locale', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="ja-easy">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate(testDate)).toBe('2025年1月01日(水)')
      })

      it('formats date in id-id locale', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="id-id">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate(testDate)).toBe('Rab, 01 Januari 2025')
      })

      it('formats date in ko locale', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="ko">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate(testDate)).toBe('2025년 1월 01일 수')
      })

      it('formats date in pt locale', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="pt">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate(testDate)).toBe('qua., 01 de janeiro de 2025')
      })

      it('formats date in vi locale', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="vi">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate(testDate)).toBe('Th 4, 01 tháng 1, 2025')
      })

      it('formats date in zh-cn locale', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="zh-cn">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate(testDate)).toBe('2025年1月01日周三')
      })

      it('formats date in zh-tw locale', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="zh-tw">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate(testDate)).toBe('2025年1月01日 週三')
      })
    })

    describe('field combinations', () => {
      it('formats only year and month', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="ja">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate(testDate, ['year', 'month'])).toBe('2025/01')
      })

      it('formats only year', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="ja">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate(testDate, ['year'])).toBe('2025年')
      })

      it('formats only month and day', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="ja">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate(testDate, ['month', 'day'])).toBe('01/01')
      })

      it('formats only weekday', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="ja">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate(testDate, ['weekday'])).toBe('水')
      })

      it('formats year, month, day, and weekday', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="ja">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate(testDate, ['year', 'month', 'day', 'weekday'])).toBe('2025/01/01(水)')
      })
    })

    describe('options', () => {
      it('disables slash in ja locale with disableSlashInJa option', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="ja">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate(testDate, ['year', 'month'], { disableSlashInJa: true })).toBe(
          '2025年1月',
        )
      })

      it('capitalizes first character with capitalize option', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="pt">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate(testDate, ['weekday'], { capitalize: true })).not.toBe('qua.')
        expect(formatDate(testDate, ['weekday'], { capitalize: true })).toBe('Qua.')
      })

      it('does not affect en-us locale with disableSlashInJa option', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="en-us">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate(testDate, ['year', 'month'], { disableSlashInJa: true })).toBe('Jan 2025')
      })

      it('handles undefined options', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="ja">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate(testDate, ['year', 'month'], undefined)).toBe('2025/01')
      })
    })

    describe('edge cases', () => {
      it('handles different dates correctly', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="ja">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current

        const date1 = new Date(2024, 11 - 1, 15) // 2024年11月15日
        expect(formatDate(date1)).toBe('2024/11/15(金)')

        const date2 = new Date(2023, 6 - 1, 30) // 2023年6月30日
        expect(formatDate(date2)).toBe('2023/06/30(金)')
      })

      it('handles empty fields array', () => {
        const wrapper: FC<PropsWithChildren> = ({ children }) => (
          <IntlProvider locale="ja">{children}</IntlProvider>
        )
        const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
        expect(formatDate(testDate, [])).toBe('2025/01/01(水)')
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
