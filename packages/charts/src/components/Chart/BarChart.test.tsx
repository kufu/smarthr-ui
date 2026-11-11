import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { IntlProvider } from 'smarthr-ui'
import { describe, expect, it, vi } from 'vitest'

import { SINGLE_CHART_COLORS } from '../../helper'

import { BarChart } from './BarChart'

import type { ChartData, ChartDataset } from 'chart.js'

// jsdomにCanvasがないため、柄の生成をモックする
vi.mock('@smarthr/patternomaly', () => ({
  draw: vi.fn(() => ({ type: 'pattern' }) as unknown as CanvasPattern),
}))

let renderedData: ChartData<'bar'> | undefined

vi.mock('react-chartjs-2', () => ({
  Bar: (props: { data: ChartData<'bar'> }) => {
    renderedData = props.data
    return null
  },
}))

const defaultProps = {
  data: {
    labels: ['レベル1'],
    datasets: [
      { label: '1年前', data: [1] },
      { label: '現在', data: [3] },
    ],
  },
  disablePatterns: true,
  singleTone: { from: 0, to: 5 },
} satisfies React.ComponentProps<typeof BarChart>

const render = (props: Partial<React.ComponentProps<typeof BarChart>> = {}) => {
  renderedData = undefined
  renderToStaticMarkup(
    <IntlProvider locale="ja">
      <BarChart {...defaultProps} {...props} />
    </IntlProvider>,
  )

  return renderedData!.datasets as Array<ChartDataset<'bar'> & { borderColor: string }>
}

describe('BarChart', () => {
  it('datasetsの順にそのまま描画する', () => {
    const datasets = render()
    expect(datasets.map((dataset) => dataset.label)).toStrictEqual(['1年前', '現在'])
  })

  it('指定した範囲の両端を第一系列と最終系列に割り当てる', () => {
    const datasets = render()
    expect(datasets.map((dataset) => [dataset.label, dataset.borderColor])).toStrictEqual([
      ['1年前', SINGLE_CHART_COLORS[0]],
      ['現在', SINGLE_CHART_COLORS[5]],
    ])
  })

  it('singleToneに範囲を渡すと濃淡を狭められる', () => {
    const datasets = render({ singleTone: { from: 0, to: 2 } })
    expect(datasets.map((dataset) => [dataset.label, dataset.borderColor])).toStrictEqual([
      ['1年前', SINGLE_CHART_COLORS[0]],
      ['現在', SINGLE_CHART_COLORS[2]],
    ])
  })

  it('系列が1つのときも濃い側の端の色になり、比較時と変わらない', () => {
    const datasets = render({
      data: { labels: ['レベル1'], datasets: [{ label: '現在', data: [3] }] },
      singleTone: { from: 0, to: 5 },
    })
    expect(datasets.map((dataset) => [dataset.label, dataset.borderColor])).toStrictEqual([
      ['現在', SINGLE_CHART_COLORS[5]],
    ])
  })

  describe('テーブル表示', () => {
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
            <BarChart {...defaultProps} onChangeView={onChangeView} />
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

    it('titleがあるとき、tableのcaptionとしてアクセシブルネームにする', () => {
      document.body.innerHTML = renderToStaticMarkup(
        <IntlProvider locale="ja">
          <BarChart {...defaultProps} defaultView="table" title="グラフのタイトル" />
        </IntlProvider>,
      )
      const table = document.querySelector('table')!

      expect(table.firstElementChild?.tagName).toBe('CAPTION')
      expect(table.querySelector('caption')?.textContent).toBe('グラフのタイトル')
    })
  })
})
