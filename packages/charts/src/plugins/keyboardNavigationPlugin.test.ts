import { describe, expect, it, vi } from 'vitest'

import { keyboardNavigationPlugin } from './keyboardNavigationPlugin'

import type { Chart } from 'chart.js'

const setup = (options: { stacked?: boolean; horizontal?: boolean; skipZero?: boolean }) => {
  const canvas = document.createElement('canvas')
  canvas.tabIndex = 0
  document.body.appendChild(canvas)

  let active: Array<{ datasetIndex: number; index: number }> = []
  const chart = {
    canvas,
    data: {
      labels: ['項目A', '項目B'],
      datasets: [
        { label: '項目Aの内訳1', data: [12, null] },
        { label: '項目Bの内訳1', data: [null, 8] },
        { label: '項目Aの内訳2', data: [19, null] },
        { label: '項目Bの内訳2', data: [null, 0] },
      ],
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
})
