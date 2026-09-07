import { renderToStaticMarkup } from 'react-dom/server'
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
  renderToStaticMarkup(<BarChart {...defaultProps} {...props} />)

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
})
