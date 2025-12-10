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

// FIXME:borderWidth, cornerRadiusはnumberなため、定義された値を使うことができない
const createBaseChartOptions = (
  { plugins }: Partial<ChartOptions<ChartType>>,
  chartType: ChartType,
): Partial<ChartOptions<ChartType>> => ({
  animation: false,
  responsive: true,
  maintainAspectRatio: false,
  events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove', 'keydown', 'keyup'],
  plugins: {
    legend: {
      position: 'bottom',
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
    ...plugins,
  },
})

export const createBarChartOptions = (
  plugins: Partial<ChartOptions>,
): Partial<ChartOptions<'bar'>> => ({
  ...createBaseChartOptions(plugins, 'bar'),
  elements: {},
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
})

export const createLineChartOptions = (
  plugins: Partial<ChartOptions>,
): Partial<ChartOptions<'line'>> => ({
  ...createBaseChartOptions(plugins, 'line'),
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
})
