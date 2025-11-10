'use client'

import { draw } from '@smarthr/patternomaly'
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

const PATTERN_SHAPE_TYPES = [
  'zigzag',
  'diamond',
  'disc',
  'zigzag-vertical',
  'diamond-box',
  'square',
  'ring',
  'plus',
  'cross',
  'diagonal',
  'triangle',
  'dash',
  'dot',
  'diagonal-right-left',
  'box',
  'triangle-inverted',
] as const

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
const createBaseChartOptions = (
  { plugins }: Partial<ChartOptions>,
  chartType: ChartType,
): Partial<ChartOptions> => ({
  responsive: true,
  maintainAspectRatio: false,
  events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove', 'keydown', 'keyup'],
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        font: { family: FONT_FAMILY },
        usePointStyle: true,
        pointStyle: chartType === 'line' ? undefined : 'rect',
        pointStyleWidth: chartType === 'line' ? undefined : 48,
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
  ...createBaseChartOptions(plugins, 'bar'),
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
  ...createBaseChartOptions(plugins, 'line'),
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
export function getChartColors<T extends 'line'>(
  chartType: T,
  dataLength: number,
): Array<
  Pick<
    ChartDataset<T>,
    | 'backgroundColor'
    | 'borderColor'
    | 'hoverBorderColor'
    | 'hoverBorderWidth'
    | 'pointStyle'
    | 'pointRadius'
  >
>
export function getChartColors<T extends Exclude<ChartType, 'line'>>(
  chartType: T,
  dataLength: number,
): Array<
  Pick<ChartDataset<T>, 'backgroundColor' | 'borderColor' | 'hoverBorderColor' | 'hoverBorderWidth'>
>
export function getChartColors<T extends ChartType>(chartType: T, dataLength: number): any {
  const colors: string[] = []
  const pointStyles = ['circle', 'rect', 'rectRounded', 'rectRot', 'star', 'triangle'] as const

  for (let i = 0; i < dataLength; i++) {
    colors.push(CHART_COLORS[i % CHART_COLORS.length])
  }

  // outline-offsetを表現できていない
  if (chartType === 'line') {
    return colors.map((color, index) => ({
      backgroundColor: color,
      borderColor: color,
      hoverBorderColor: defaultColor.OUTLINE,
      hoverBorderWidth: 4,
      pointStyle: pointStyles[index % pointStyles.length],
      pointRadius: 4,
    }))
  }
  return colors.map((color, index) => ({
    // データが１件だけのときはパターンをつけない
    backgroundColor: index
      ? draw(PATTERN_SHAPE_TYPES[index % PATTERN_SHAPE_TYPES.length], color)
      : color,
    borderColor: color,
    hoverBorderColor: defaultColor.OUTLINE,
    hoverBorderWidth: 4,
  }))
}
