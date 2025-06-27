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
import { CHART_COLORS, SINGLE_CHART_COLORS } from 'smarthr-ui'

import type { ChartOptions } from 'chart.js'

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
  )
}

const createBaseChartOptions = (): Partial<ChartOptions> => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        font: {
          family: 'system-ui, sans-serif',
          size: 12,
        },
        color: '#333',
        padding: 16,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: CHART_COLORS[0],
      borderWidth: 1,
      cornerRadius: 4,
    },
  },
  animation: {
    duration: 750,
    easing: 'easeInOutQuart',
  },
})

export const createBarChartOptions = (): Partial<ChartOptions<'bar'>> => ({
  ...createBaseChartOptions(),
  elements: {
    bar: {
      borderWidth: 0,
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

/**
 * データ数に応じて適切なカラーパレットを取得
 */
export const getChartColors = (dataLength: number): string[] => {
  if (dataLength === 1) {
    return [SINGLE_CHART_COLORS[0]]
  }

  if (dataLength <= CHART_COLORS.length) {
    return CHART_COLORS.slice(0, dataLength)
  }

  // データ数がカラーパレットを超える場合は繰り返し使用
  const colors: string[] = []
  for (let i = 0; i < dataLength; i++) {
    colors.push(CHART_COLORS[i % CHART_COLORS.length])
  }

  return colors
}
