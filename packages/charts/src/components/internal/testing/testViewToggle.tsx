import { type ReactElement, act } from 'react'
import { createRoot } from 'react-dom/client'
import { IntlProvider } from 'smarthr-ui'
import { expect, it, vi } from 'vitest'

import type { ChartViewType } from '../../../helper'

export const testViewToggle = (
  renderChart: (onChangeView: (value: ChartViewType) => void) => ReactElement,
) => {
  it('切り替えボタンでグラフと表を切り替え、onChangeViewに通知する', () => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    const onChangeView = vi.fn()
    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = createRoot(container)
    const click = (label: string) =>
      act(() => container.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)!.click())

    act(() => root.render(<IntlProvider locale="ja">{renderChart(onChangeView)}</IntlProvider>))
    expect(container.querySelector('table')).toBeNull()

    click('テーブル')
    expect(container.querySelector('table')).not.toBeNull()
    expect(onChangeView).toHaveBeenLastCalledWith('table')

    click('グラフ')
    expect(container.querySelector('table')).toBeNull()
    expect(onChangeView).toHaveBeenLastCalledWith('chart')

    act(() => root.unmount())
    vi.unstubAllGlobals()
  })
}
