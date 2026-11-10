import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { IntlProvider } from 'smarthr-ui'
import { describe, expect, it, vi } from 'vitest'

import { DoughnutChart } from './DoughnutChart'

// jsdomにCanvasがないため、グラフ描画をモックする
vi.mock('react-chartjs-2', () => ({ Doughnut: () => null }))

const data = {
  labels: ['項目A', '項目B'],
  datasets: [{ label: '系列1', data: [1, 2] }],
}

describe('DoughnutChart', () => {
  it('切り替えボタンでグラフと表を切り替え、onChangeViewに通知する', () => {
    const onChangeView = vi.fn()
    const container = document.body.appendChild(document.createElement('div'))
    const root = createRoot(container)
    const hasTable = () => container.querySelector('table') !== null
    const clickButton = (label: string) =>
      act(() => container.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)!.click())

    act(() =>
      root.render(
        <IntlProvider locale="ja">
          <DoughnutChart data={data} disablePatterns onChangeView={onChangeView} />
        </IntlProvider>,
      ),
    )
    expect(hasTable()).toBe(false)

    clickButton('テーブル')
    expect(hasTable()).toBe(true)
    expect(onChangeView).toHaveBeenLastCalledWith('table')

    clickButton('グラフ')
    expect(hasTable()).toBe(false)
    expect(onChangeView).toHaveBeenLastCalledWith('chart')

    act(() => root.unmount())
    container.remove()
  })
})
