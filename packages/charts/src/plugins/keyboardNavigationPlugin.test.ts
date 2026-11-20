import {
  BarController,
  BarElement,
  BasicPlatform,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
} from 'chart.js'
import { describe, expect, it, vi } from 'vitest'

import { keyboardNavigationPlugin, resolveLiveRegionText } from './keyboardNavigationPlugin'

import type { Chart } from 'chart.js'

const defaultDatasets = [
  { label: '項目Aの内訳1', data: [12, null] },
  { label: '項目Bの内訳1', data: [null, 8] },
  { label: '項目Aの内訳2', data: [19, null] },
  { label: '項目Bの内訳2', data: [null, 0] },
]

const setup = (
  options: { stacked?: boolean; horizontal?: boolean; skipZero?: boolean },
  datasets: Array<{ label: string; data: Array<number | null> }> = defaultDatasets,
) => {
  const canvas = document.createElement('canvas')
  canvas.tabIndex = 0
  document.body.appendChild(canvas)

  let active: Array<{ datasetIndex: number; index: number }> = []
  const chart = {
    canvas,
    data: {
      labels: datasets[0].data.map((_, index) => `項目${index}`),
      datasets,
    },
    getActiveElements: () => active,
    setActiveElements: (elements: typeof active) => {
      active = elements
    },
    tooltip: { setActiveElements: vi.fn() },
    update: vi.fn(),
  } as unknown as Chart

  keyboardNavigationPlugin.afterInit(chart, {}, options)
  canvas.focus()

  return (key: string) => {
    canvas.dispatchEvent(new KeyboardEvent('keydown', { key }))
    return active[0]
  }
}

describe('keyboardNavigationPlugin', () => {
  it('積み上げでデータセットを移動するとき、値がnullの位置は飛ばす', () => {
    const press = setup({ stacked: true, horizontal: true })

    expect(press('ArrowRight')).toEqual({ datasetIndex: 0, index: 0 })
    expect(press('ArrowRight')).toEqual({ datasetIndex: 2, index: 0 })
  })

  it('積み上げでデータを移動するとき、移動先で値を持つデータセットを選ぶ', () => {
    const press = setup({ stacked: true, horizontal: true })

    press('ArrowRight')
    expect(press('ArrowDown')).toEqual({ datasetIndex: 1, index: 1 })
  })

  it('積み上げでないとき、値がnullの位置は飛ばして次のデータへ移動する', () => {
    const press = setup({ horizontal: true })

    expect(press('ArrowDown')).toEqual({ datasetIndex: 0, index: 0 })
    expect(press('ArrowDown')).toEqual({ datasetIndex: 2, index: 0 })
    expect(press('ArrowDown')).toEqual({ datasetIndex: 1, index: 1 })
  })

  it('skipZeroを指定すると、値が0の位置も飛ばす', () => {
    const press = setup({ stacked: true, horizontal: true, skipZero: true })

    press('ArrowDown')
    press('ArrowDown')
    expect(press('ArrowRight')).toEqual({ datasetIndex: 1, index: 1 })
  })

  it('積み上げでデータを移動するとき、全てのデータセットに値がないデータは飛ばす', () => {
    const press = setup({ stacked: true, horizontal: true }, [
      { label: '商品A', data: [12, null, 8] },
      { label: '商品B', data: [5, null, 4] },
    ])

    press('ArrowDown')
    expect(press('ArrowDown')).toEqual({ datasetIndex: 0, index: 2 })
  })

  it('skipZeroを指定すると、積み上げで全てのデータセットが0のデータは飛ばす', () => {
    const press = setup({ stacked: true, horizontal: true, skipZero: true }, [
      { label: '商品A', data: [12, 0, 8] },
      { label: '商品B', data: [5, 0, 4] },
    ])

    press('ArrowDown')
    expect(press('ArrowDown')).toEqual({ datasetIndex: 0, index: 2 })
  })

  it('移動先がひとつもないとき、未選択のままにする', () => {
    const datasets = [
      { label: '商品A', data: [0, 0] },
      { label: '商品B', data: [0, 0] },
    ]

    const press = setup({ skipZero: true }, datasets)
    expect(press('ArrowLeft')).toBeUndefined()
    expect(press('ArrowRight')).toBeUndefined()

    const pressStacked = setup({ stacked: true, skipZero: true }, datasets)
    expect(pressStacked('ArrowLeft')).toBeUndefined()
    expect(pressStacked('ArrowDown')).toBeUndefined()
  })
})

describe('keyboardNavigationPlugin（Chart.jsのインスタンス経由）', () => {
  // モックのchartではChart.jsのオプション解決を通らないため、実際のインスタンスで確認する
  it('formatLiveRegionTextの結果をライブリージョンに書き込む', () => {
    ChartJS.register(BarController, BarElement, CategoryScale, LinearScale)

    const canvas = document.createElement('canvas')
    canvas.tabIndex = 0
    document.body.appendChild(canvas)

    // jsdomのcanvasは描画できないため、2Dコンテキストの呼び出しをすべて空振りさせる
    const context: CanvasRenderingContext2D = new Proxy({} as CanvasRenderingContext2D, {
      get: (_, key) => {
        if (key === 'canvas') return canvas
        if (key === 'measureText') return () => ({ width: 0 })
        return () => {}
      },
      set: () => true,
    })
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context)

    const liveRegion = document.createElement('div')
    liveRegion.id = 'live-region'
    document.body.appendChild(liveRegion)

    const formatLiveRegionText = vi.fn(
      ({ datasetLabel, label, value }) => `${label}: ${datasetLabel} ${value}`,
    )
    const chart = new ChartJS(canvas, {
      type: 'bar',
      platform: BasicPlatform,
      data: { labels: ['4月'], datasets: [{ label: '正社員', data: [12] }] },
      options: {
        animation: false,
        responsive: false,
        plugins: {
          keyboardNavigation: { liveRegionId: liveRegion.id, formatLiveRegionText },
        },
      },
      plugins: [keyboardNavigationPlugin],
    })

    canvas.focus()
    canvas.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))

    expect(liveRegion.textContent).toBe('4月: 正社員 12')
    expect(formatLiveRegionText).toHaveBeenCalledWith({
      datasetLabel: '正社員',
      label: '4月',
      value: '12',
    })

    chart.destroy()
    vi.restoreAllMocks()
  })
})

describe('resolveLiveRegionText', () => {
  describe('formatが未指定の場合', () => {
    it('半角スペースで連結する', () => {
      expect(resolveLiveRegionText({ datasetLabel: '正社員', label: '4月', value: '12' })).toBe(
        '正社員 4月 12',
      )
    })

    it('空の要素を除いて連結する', () => {
      expect(resolveLiveRegionText({ datasetLabel: '', label: '4月', value: '12' })).toBe('4月 12')
      expect(resolveLiveRegionText({ datasetLabel: '', label: '', value: '12' })).toBe('12')
    })

    it('値が0でも除外しない', () => {
      expect(resolveLiveRegionText({ datasetLabel: '正社員', label: '4月', value: '0' })).toBe(
        '正社員 4月 0',
      )
    })
  })

  describe('formatが指定された場合', () => {
    it('formatの結果を返す', () => {
      const format = vi.fn(() => 'Full-time employee April 12')

      expect(
        resolveLiveRegionText({ datasetLabel: '正社員', label: '4月', value: '12' }, format),
      ).toBe('Full-time employee April 12')
      expect(format).toHaveBeenCalledWith({ datasetLabel: '正社員', label: '4月', value: '12' })
    })
  })
})
