import { describe, expect, it } from 'vitest'

import { SMARTHR_DEFAULT_COLORS } from '../helper'

import { createBarChartOptions, createLineChartOptions } from './chartConfig'

import type { ChartOptions } from 'chart.js'

describe('createBarChartOptions', () => {
  it('外部オプションと内部デフォルトを深くマージすること', () => {
    const result = createBarChartOptions({
      scales: {
        y: {
          ticks: { stepSize: 50 },
          grid: { display: false },
        },
      },
    })

    // 内部設定が保持される
    expect(result.scales?.y?.beginAtZero).toBe(true)
    expect(result.scales?.y?.grid?.color).toBe(SMARTHR_DEFAULT_COLORS.BORDER)

    // 外部設定が反映される
    expect(result.scales?.y?.ticks?.stepSize).toBe(50)
    expect(result.scales?.y?.grid?.display).toBe(false)
  })

  it('外部からsuggestedMaxを設定できること', () => {
    const result = createBarChartOptions({
      scales: {
        y: {
          suggestedMax: 150,
        },
      },
    })

    expect(result.scales?.y?.suggestedMax).toBe(150)
    expect(result.scales?.y?.beginAtZero).toBe(true)
  })

  it('x軸のgrid設定も深くマージされること', () => {
    const result = createBarChartOptions({
      scales: {
        x: {
          grid: {
            display: false,
            lineWidth: 2,
          },
        },
      },
    })

    // 内部設定が保持される
    expect(result.scales?.x?.grid?.color).toBe(SMARTHR_DEFAULT_COLORS.BORDER)

    // 外部設定が反映される
    expect(result.scales?.x?.grid?.display).toBe(false)
    expect(result.scales?.x?.grid?.lineWidth).toBe(2)
  })

  it('tooltipの設定が外部から上書きできないこと（保護されている）', () => {
    const result = createBarChartOptions({
      plugins: {
        tooltip: {
          backgroundColor: '#ff0000',
          titleColor: '#00ff00',
          bodyColor: '#0000ff',
          borderColor: '#ff00ff',
          borderWidth: 10,
          cornerRadius: 20,
        } as ChartOptions<'bar'>['plugins']['tooltip'],
      },
    })

    // 内部のtooltip設定が保持される（外部設定は無視される）
    expect(result.plugins?.tooltip?.backgroundColor).toBe(SMARTHR_DEFAULT_COLORS.BACKGROUND)
    expect(result.plugins?.tooltip?.titleColor).toBe(SMARTHR_DEFAULT_COLORS.TEXT_BLACK)
    expect(result.plugins?.tooltip?.bodyColor).toBe(SMARTHR_DEFAULT_COLORS.TEXT_BLACK)
    expect(result.plugins?.tooltip?.borderColor).toBe(SMARTHR_DEFAULT_COLORS.BORDER)
    expect(result.plugins?.tooltip?.borderWidth).toBe(1)
    expect(result.plugins?.tooltip?.cornerRadius).toBe(4)
  })

  it('その他のplugin設定は外部から追加できること', () => {
    const result = createBarChartOptions({
      plugins: {
        datalabels: {
          display: true,
          anchor: 'end',
          align: 'end',
        },
      },
    })

    expect(result.plugins?.datalabels?.display).toBe(true)
    expect(result.plugins?.datalabels?.anchor).toBe('end')
    expect(result.plugins?.datalabels?.align).toBe('end')
  })

  it('複数のscales設定を同時にマージできること', () => {
    const result = createBarChartOptions({
      scales: {
        x: {
          ticks: { maxRotation: 45 },
          grid: { display: false },
        },
        y: {
          ticks: { stepSize: 50 },
          suggestedMax: 150,
          grid: { drawBorder: false },
        },
      },
    })

    // x軸の設定
    expect(result.scales?.x?.ticks?.maxRotation).toBe(45)
    expect(result.scales?.x?.grid?.display).toBe(false)
    expect(result.scales?.x?.grid?.color).toBe(SMARTHR_DEFAULT_COLORS.BORDER)

    // y軸の設定
    expect(result.scales?.y?.beginAtZero).toBe(true)
    expect(result.scales?.y?.ticks?.stepSize).toBe(50)
    expect(result.scales?.y?.suggestedMax).toBe(150)
    expect(result.scales?.y?.grid?.drawBorder).toBe(false)
    expect(result.scales?.y?.grid?.color).toBe(SMARTHR_DEFAULT_COLORS.BORDER)
  })
})

describe('createLineChartOptions', () => {
  it('外部オプションと内部デフォルトを深くマージすること', () => {
    const result = createLineChartOptions({
      scales: {
        y: {
          ticks: { stepSize: 50 },
          grid: { display: false },
        },
      },
    })

    // 内部設定が保持される
    expect(result.scales?.y?.grid?.color).toBe(SMARTHR_DEFAULT_COLORS.BORDER)

    // 外部設定が反映される
    expect(result.scales?.y?.ticks?.stepSize).toBe(50)
    expect(result.scales?.y?.grid?.display).toBe(false)
  })

  it('外部からsuggestedMaxを設定できること', () => {
    const result = createLineChartOptions({
      scales: {
        y: {
          suggestedMax: 150,
        },
      },
    })

    expect(result.scales?.y?.suggestedMax).toBe(150)
  })

  it('x軸とy軸の両方のgrid設定が深くマージされること', () => {
    const result = createLineChartOptions({
      scales: {
        x: {
          grid: { display: false },
        },
        y: {
          grid: { lineWidth: 3 },
        },
      },
    })

    // 内部設定が保持される
    expect(result.scales?.x?.grid?.color).toBe(SMARTHR_DEFAULT_COLORS.BORDER)
    expect(result.scales?.y?.grid?.color).toBe(SMARTHR_DEFAULT_COLORS.BORDER)

    // 外部設定が反映される
    expect(result.scales?.x?.grid?.display).toBe(false)
    expect(result.scales?.y?.grid?.lineWidth).toBe(3)
  })

  it('tooltipの設定が外部から上書きできないこと（保護されている）', () => {
    const result = createLineChartOptions({
      plugins: {
        tooltip: {
          backgroundColor: '#ff0000',
          titleColor: '#00ff00',
        } as ChartOptions<'line'>['plugins']['tooltip'],
      },
    })

    // 内部のtooltip設定が保持される（外部設定は無視される）
    expect(result.plugins?.tooltip?.backgroundColor).toBe(SMARTHR_DEFAULT_COLORS.BACKGROUND)
    expect(result.plugins?.tooltip?.titleColor).toBe(SMARTHR_DEFAULT_COLORS.TEXT_BLACK)
  })

  it('datalabelsなどの他のplugin設定は外部から追加できること', () => {
    const result = createLineChartOptions({
      plugins: {
        datalabels: {
          display: true,
          backgroundColor: '#fff',
        },
      },
    })

    expect(result.plugins?.datalabels?.display).toBe(true)
    expect(result.plugins?.datalabels?.backgroundColor).toBe('#fff')
  })
})
