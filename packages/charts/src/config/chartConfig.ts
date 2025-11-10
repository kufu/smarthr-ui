'use client'

import { generate } from '@smarthr/patternomaly'
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
import { CHART_COLORS, FONT_FAMILY, defaultColor } from 'smarthr-ui'

import { keyboardNavigationPlugin } from '../plugins'

import type { ChartDataset, ChartOptions, ChartType } from 'chart.js'

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

// FIXME:borderWidth, cornerRadiusはnumberなため、定義された値を使うことができない
const createBaseChartOptions = ({ plugins }: Partial<ChartOptions>): Partial<ChartOptions> => ({
  responsive: true,
  maintainAspectRatio: false,
  events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove', 'keydown', 'keyup'],
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        font: { family: FONT_FAMILY },
      },
    },
    tooltip: {
      backgroundColor: defaultColor.BACKGROUND,
      titleColor: defaultColor.TEXT_BLACK,
      bodyColor: defaultColor.TEXT_BLACK,
      borderColor: defaultColor.BORDER,
      borderWidth: 1,
      cornerRadius: 4,
    },
    ...plugins,
  },
})

export const createBarChartOptions = (
  plugins: Partial<ChartOptions>,
): Partial<ChartOptions<'bar'>> => ({
  ...createBaseChartOptions(plugins),
  elements: {},
  scales: {
    x: {
      grid: {
        color: defaultColor.BORDER,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: defaultColor.BORDER,
      },
    },
  },
})

export const createLineChartOptions = (
  plugins: Partial<ChartOptions>,
): Partial<ChartOptions<'line'>> => ({
  ...createBaseChartOptions(plugins),
  scales: {
    x: {
      grid: {
        color: defaultColor.BORDER,
      },
    },
    y: {
      grid: {
        color: defaultColor.BORDER,
      },
    },
  },
})

// TODO: SINGLE_CHART_COLORS を使うオプションを追加する
export const getChartColors = <T extends ChartType>(
  dataLength: number,
): Array<
  Pick<ChartDataset<T>, 'backgroundColor' | 'borderColor' | 'hoverBorderColor' | 'hoverBorderWidth'>
> => {
  const colors: string[] = []
  for (let i = 0; i < dataLength; i++) {
    colors.push(CHART_COLORS[i % CHART_COLORS.length])
  }

  // outline-offsetを表現できていない
  return generate(colors).map((color) => ({
    backgroundColor: color,
    borderColor: color,
    hoverBorderColor: defaultColor.OUTLINE,
    hoverBorderWidth: 4,
  }))
}
