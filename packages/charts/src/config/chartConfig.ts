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
import ChartDataLabels from 'chartjs-plugin-datalabels'

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
    ChartDataLabels,
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
  chartType,
  options = {},
}: {
  chartType: T
  options?: Partial<ChartOptions<T>>
}): CreateBaseChartOptionsReturn<T> => {
  // 内部で保護する設定を定義
  const internalTooltipConfig = {
    backgroundColor: SMARTHR_DEFAULT_COLORS.BACKGROUND,
    titleColor: SMARTHR_DEFAULT_COLORS.TEXT_BLACK,
    bodyColor: SMARTHR_DEFAULT_COLORS.TEXT_BLACK,
    borderColor: SMARTHR_DEFAULT_COLORS.BORDER,
    borderWidth: 1,
    cornerRadius: 4,
  }

  const internalLegendLabels = generateLegendOptions(chartType)

  // 外部pluginsからtooltipを除外（内部設定を保護するため）
  const { tooltip: _tooltip, ...safeExternalPlugins } = options.plugins || {}

  // 外部オプションからplugins.tooltipを除外したオプションを作成
  const safeExternalOptions = {
    ...options,
    plugins: safeExternalPlugins,
  }

  const baseDefaults = {
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove', 'keydown', 'keyup'],
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: internalLegendLabels,
      },
      tooltip: internalTooltipConfig,
      ...safeExternalPlugins,
    },
  }

  // 外部オプションとベースデフォルトをマージ
  return deepmerge(baseDefaults, safeExternalOptions) as CreateBaseChartOptionsReturn<T>
}

export const createBarChartOptions = (
  options: Partial<ChartOptions<'bar'>> = {},
): Partial<ChartOptions<'bar'>> => {
  const baseOptions = createBaseChartOptions({
    chartType: 'bar',
    options,
  })

  const scalesDefaults = {
    scales: {
      x: {
        grid: {
          color: SMARTHR_DEFAULT_COLORS.BORDER,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: SMARTHR_DEFAULT_COLORS.BORDER,
        },
      },
    },
  }

  // scalesDefaultsをベースに、baseOptionsをマージ(外部設定を優先)
  return deepmerge(scalesDefaults, baseOptions) as Partial<ChartOptions<'bar'>>
}

export const createLineChartOptions = (
  options: Partial<ChartOptions<'line'>> = {},
): Partial<ChartOptions<'line'>> => {
  const baseOptions = createBaseChartOptions({
    chartType: 'line',
    options,
  })

  const scalesDefaults = {
    scales: {
      x: {
        grid: {
          color: SMARTHR_DEFAULT_COLORS.BORDER,
        },
      },
      y: {
        grid: {
          color: SMARTHR_DEFAULT_COLORS.BORDER,
        },
      },
    },
  }

  // scalesDefaultsをベースに、baseOptionsをマージ(外部設定を優先)
  return deepmerge(scalesDefaults, baseOptions) as Partial<ChartOptions<'line'>>
}
