import { renderHook } from '@testing-library/react'
import { IntlProvider } from 'react-intl'

import { useIntl } from './useIntl'

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
})
