'use client'

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'

import deepmerge from 'deepmerge'

import { BORDER_DASHES, CHART_COLORS, FONT_FAMILY, SMARTHR_DEFAULT_COLORS } from '../helper'
import { keyboardNavigationPlugin } from '../plugins'

import type { ChartOptions, ChartType, LegendOptions } from 'chart.js'

/**
 * Chart.jsの必要な要素を登録
 */
export const registerChartComponents = () => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    keyboardNavigationPlugin,
  )
}

/** Lineチャートのレジェンドはポインターではなく線にしたいが、lineDash を簡単に指定できないため generateLabels を使っている */
/** TODO: 折れ線グラフはレジェンドを線+ポイントにしたい */
const generateLegendOptions = <TType extends ChartType>(
  chartType: TType,
): Partial<LegendOptions<TType>['labels']> => {
  if (chartType === 'line') {
    return {
      font: { family: FONT_FAMILY },
      usePointStyle: true,
      pointStyleWidth: 48,
      generateLabels: (chart) =>
        chart.data.datasets.map((dataset, index) => ({
          text: dataset.label,
          strokeStyle: CHART_COLORS[index % CHART_COLORS.length],
          lineDash: BORDER_DASHES[index % BORDER_DASHES.length],
          lineWidth: 4,
          pointStyle: 'line',
        })),
    }
  }
  return {
    font: { family: FONT_FAMILY },
    pointStyle: 'rect',
    pointStyleWidth: 48,
  }
}

type CreateBaseChartOptionsReturn<T extends ChartType> = T extends 'line'
  ? Partial<ChartOptions<'line'>>
  : Partial<ChartOptions<'bar'>>

// FIXME:borderWidth, cornerRadiusはnumberなため、定義された値を使うことができない
const createBaseChartOptions = <T extends ChartType>({
  plugins,
  chartType,
  externalOptions = {},
}: {
  plugins?: ChartOptions<T>['plugins']
  chartType: T
  externalOptions?: Partial<ChartOptions<T>>
}): CreateBaseChartOptionsReturn<T> => {
  const baseDefaults = {
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove', 'keydown', 'keyup'],
    plugins: {
      ...plugins,
      legend: {
        position: 'bottom' as const,
        labels: generateLegendOptions(chartType),
      },
      tooltip: {
        backgroundColor: SMARTHR_DEFAULT_COLORS.BACKGROUND,
        titleColor: SMARTHR_DEFAULT_COLORS.TEXT_BLACK,
        bodyColor: SMARTHR_DEFAULT_COLORS.TEXT_BLACK,
        borderColor: SMARTHR_DEFAULT_COLORS.BORDER,
        borderWidth: 1,
        cornerRadius: 4,
      },
    },
  }

  // 外部オプションとベースデフォルトをマージ
  // 外部オプションが先、内部デフォルトが後なので内部が優先される
  return deepmerge(externalOptions, baseDefaults, {
    // tooltip と generateLabels は完全に内部設定を優先
    customMerge: (key) => {
      if (key === 'tooltip' || key === 'generateLabels') {
        return (_, internal) => internal
      }
      return undefined
    },
  }) as CreateBaseChartOptionsReturn<T>
}

export const createBarChartOptions = (
  options: Partial<ChartOptions<'bar'>> = {},
): Partial<ChartOptions<'bar'>> => {
  const { plugins, ...restOptions } = options

  const baseOptions = createBaseChartOptions({
    plugins,
    chartType: 'bar',
    externalOptions: restOptions,
  })

  const scalesDefaults = {
    scales: {
      x: {
        ...restOptions.scales?.x,
        grid: {
          ...restOptions.scales?.x?.grid,
          color: SMARTHR_DEFAULT_COLORS.BORDER,
        },
      },
      y: {
        beginAtZero: true,
        ...restOptions.scales?.y,
        grid: {
          ...restOptions.scales?.y?.grid,
          color: SMARTHR_DEFAULT_COLORS.BORDER,
        },
      },
    },
  }

  return deepmerge(baseOptions, scalesDefaults) as Partial<ChartOptions<'bar'>>
}

export const createLineChartOptions = (
  options: Partial<ChartOptions<'line'>> = {},
): Partial<ChartOptions<'line'>> => {
  const { plugins, ...restOptions } = options

  const baseOptions = createBaseChartOptions({
    plugins,
    chartType: 'line',
    externalOptions: restOptions,
  })

  const scalesDefaults = {
    scales: {
      x: {
        ...restOptions.scales?.x,
        grid: {
          ...restOptions.scales?.x?.grid,
          color: SMARTHR_DEFAULT_COLORS.BORDER,
        },
      },
      y: {
        ...restOptions.scales?.y,
        grid: {
          ...restOptions.scales?.y?.grid,
          color: SMARTHR_DEFAULT_COLORS.BORDER,
        },
      },
    },
  }

  return deepmerge(baseOptions, scalesDefaults) as Partial<ChartOptions<'line'>>
}
