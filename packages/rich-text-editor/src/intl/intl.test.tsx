import { renderHook } from '@testing-library/react'
import { IntlProvider as ReactIntlProvider, useIntl as useReactIntl } from 'react-intl'
import { IntlProvider } from 'smarthr-ui'

import { locales } from './locales'
import { useIntl } from './useIntl'

import type { FC, PropsWithChildren } from 'react'

const wrapperOf =
  (locale: string): FC<PropsWithChildren> =>
  ({ children }) => <IntlProvider locale={locale}>{children}</IntlProvider>

describe('intl', () => {
  describe('useIntl', () => {
    it('専用辞書の文言を解決する', () => {
      const { localize } = renderHook(() => useIntl(), { wrapper: wrapperOf('ja') }).result.current

      expect(localize({ id: 'smarthr-ui/RichTextEditor/bold', defaultText: '太字' })).toBe('太字')
    })

    it('未翻訳のロケールでは日本語のdefaultTextにフォールバックする', () => {
      const { localize } = renderHook(() => useIntl(), { wrapper: wrapperOf('en-us') }).result
        .current

      expect(localize({ id: 'smarthr-ui/RichTextEditor/bold', defaultText: '太字' })).toBe('太字')
    })

    it('値を埋め込める', () => {
      const { localize } = renderHook(() => useIntl(), { wrapper: wrapperOf('ja') }).result.current

      expect(
        localize(
          { id: 'smarthr-ui/RichTextEditor/characterCount', defaultText: '文字数：{count}' },
          { count: 12 },
        ),
      ).toBe('文字数：12')
    })

    it('smarthr-uiのIntlProviderで切り替えたロケールを引き継ぐ', () => {
      expect(renderHook(() => useIntl(), { wrapper: wrapperOf('ja') }).result.current.locale).toBe(
        'ja',
      )
      expect(
        renderHook(() => useIntl(), { wrapper: wrapperOf('en-us') }).result.current.locale,
      ).toBe('en-us')
      expect(
        renderHook(() => useIntl(), { wrapper: wrapperOf('zh_hant_tw') }).result.current.locale,
      ).toBe('zh-tw')
    })

    it('外側のIntlProviderのmessagesを上書きしない', () => {
      const wrapper: FC<PropsWithChildren> = ({ children }) => (
        <ReactIntlProvider locale="ja" messages={{ test: 'テスト' }}>
          <IntlProvider locale="ja">{children}</IntlProvider>
        </ReactIntlProvider>
      )

      expect(
        renderHook(() => useIntl(), { wrapper }).result.current.localize({
          id: 'smarthr-ui/RichTextEditor/bold',
          defaultText: '太字',
        }),
      ).toBe('太字')
      expect(
        renderHook(() => useReactIntl(), { wrapper }).result.current.formatMessage({ id: 'test' }),
      ).toBe('テスト')
    })
  })

  describe('locales', () => {
    it('全ロケールがjaと同じキーを持つ', () => {
      const jaKeys = Object.keys(locales.ja).sort()

      for (const [name, messages] of Object.entries(locales)) {
        expect([name, Object.keys(messages).sort()]).toEqual([name, jaKeys])
      }
    })

    it('全てのキーがRichTextEditor専用の名前空間に属する', () => {
      for (const key of Object.keys(locales.ja)) {
        expect(key).toMatch(/^smarthr-ui\/RichTextEditor\//)
      }
    })
  })
})
