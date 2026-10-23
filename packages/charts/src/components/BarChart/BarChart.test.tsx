import { act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { SINGLE_CHART_COLORS } from '../../helper'
import { stackedGroupsExpanded } from '../__stories__/testData'

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

  describe('テーブル表示', () => {
    let roots: Root[] = []

    const renderTable = (props: Partial<React.ComponentProps<typeof BarChart>> = {}) => {
      const container = document.body.appendChild(document.createElement('div'))
      const root = createRoot(container)
      roots.push(root)
      // HINT: actで包まないとReact 19では描画が後回しになり、afterEachでモックを戻した後に
      //       new ResizeObserver が実行されて "ResizeObserver is not a constructor" になる
      act(() => root.render(<BarChart {...defaultProps} {...props} defaultView="table" />))
      return container
    }

    const OriginalResizeObserver = global.ResizeObserver

    beforeEach(() => {
      ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

      // jsdomにResizeObserverがないため、Tableのスクロール監視をモックする
      global.ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
      } as unknown as typeof ResizeObserver
    })

    afterEach(() => {
      act(() => roots.forEach((root) => root.unmount()))
      roots = []
      document.body.innerHTML = ''
      global.ResizeObserver = OriginalResizeObserver
    })

    it('グループの行を開閉できる', () => {
      const container = renderTable({ data: stackedGroupsExpanded })
      const toggleButton = container.querySelector('button[aria-expanded]') as HTMLButtonElement
      const childRows = toggleButton
        .getAttribute('aria-controls')!
        .split(' ')
        .map((id) => document.getElementById(id) as HTMLElement)

      expect(toggleButton.getAttribute('aria-expanded')).toBe('false')
      expect(childRows.every((row) => row.hasAttribute('hidden'))).toBe(true)
      act(() => toggleButton.click())

      expect(toggleButton.getAttribute('aria-expanded')).toBe('true')
      expect(childRows.every((row) => row.hasAttribute('hidden'))).toBe(false)
    })

    it('グルーピングされていないデータセットはDOM順に描画される', () => {
      const container = renderTable()
      const cellTexts = [...container.querySelectorAll('th, td')].map((cell) => cell.textContent)

      expect(cellTexts).toStrictEqual(['', '1年前', '現在', 'レベル1', '1', '3'])
    })
  })
})
