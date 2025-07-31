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
import { CHART_COLORS, FONT_FAMILY, defaultColor, defaultRadius } from 'smarthr-ui'

import { keyboardNavigationPlugin } from '../plugins'

import type { ChartDataset, ChartOptions } from 'chart.js'

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
        usePointStyle: true,
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
  elements: {
    bar: {
      borderRadius: 4,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
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

// TODO: SINGLE_CHART_COLORS を使うオプションを追加する
export const getChartColors = (
  dataLength: number,
): Array<
  Pick<
    ChartDataset<'bar'>,
    'backgroundColor' | 'borderColor' | 'hoverBorderColor' | 'hoverBorderWidth'
  >
> => {
  const colors: string[] = []
  for (let i = 0; i < dataLength; i++) {
    colors.push(CHART_COLORS[i % CHART_COLORS.length])
  }

  // outline-offsetを表現できていない
  return colors.map((color) => ({
    backgroundColor: color,
    borderColor: color,
    hoverBorderColor: defaultColor.OUTLINE,
    hoverBorderWidth: 4,
  }))
}
