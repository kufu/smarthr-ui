import { renderHook } from '@testing-library/react'
import { IntlProvider as ReactIntlProvider, useIntl as useReactIntl } from 'react-intl'

import { IntlProvider, useIntl } from '.'

import type { FC, PropsWithChildren } from 'react'

describe('useIntl', () => {
  it('returns date in correct ja format', async () => {
    const wrapper: FC<PropsWithChildren> = ({ children }) => (
      <IntlProvider locale="ja">{children}</IntlProvider>
    )
    const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
    const date = new Date(2025, 1 - 1, 1)
    const ret = formatDate(date)
    expect(ret).toBe('2025/01/01')
  })

  it('returns date in correct en-us format', async () => {
    const wrapper: FC<PropsWithChildren> = ({ children }) => (
      <IntlProvider locale="en-us">{children}</IntlProvider>
    )
    const { formatDate } = renderHook(() => useIntl(), { wrapper }).result.current
    const date = new Date(2025, 1 - 1, 1)
    const ret = formatDate(date)
    expect(ret).toBe('1/1/2025')
  })

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
})
