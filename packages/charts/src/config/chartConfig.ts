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
import { CHART_COLORS, FONT_FAMILY } from 'smarthr-ui'

import { keyboardNavigationPlugin } from '../plugins'

import type { ChartDataset, ChartOptions } from 'chart.js'

// TODO: themeProviderから取得する
const OUTLINE_COLOR = '#0077c7'

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
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: '#fff',
      borderWidth: 1,
      cornerRadius: 4,
    },
    ...plugins,
  },
  animation: {
    duration: 750,
    easing: 'easeInOutQuart',
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
        color: 'rgba(0, 0, 0, 0.1)',
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
    hoverBorderColor: OUTLINE_COLOR,
    hoverBorderWidth: 4,
  }))
}
