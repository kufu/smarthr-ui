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

import type { ChartDataset, ChartOptions, ChartType, LegendOptions } from 'chart.js'

const SHAPE_TYPES = [
  'diamond',
  'zigzag',
  'disc',
  'zigzag-vertical',
  'diamond-box',
  'plus',
  'square',
  'ring',
  'diagonal',
  'cross',
  'triangle',
  'dash',
  'dot',
  'diagonal-right-left',
  'box',
  'triangle-inverted',
] as const

const BORDER_DASHES = [[], [10, 10], [20, 5], [15, 3, 3, 3], [2, 2]] as const satisfies number[][]

const POINT_STYLES = ['circle', 'rect', 'rectRounded', 'rectRot', 'triangle'] as const

const getColor = (index: number) => CHART_COLORS[index % CHART_COLORS.length]

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
/** 折れ線グラフはレジェンドを線+ポイントにしたい */
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
          strokeStyle: getColor(index),
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
  { plugins }: Partial<ChartOptions>,
  chartType: ChartType,
): Partial<ChartOptions> => ({
  responsive: true,
  maintainAspectRatio: false,
  events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove', 'keydown', 'keyup'],
  plugins: {
    legend: {
      position: 'bottom',
      labels: generateLegendOptions(chartType),
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

  for (let i = 0; i < dataLength; i++) {
    colors.push(getColor(i))
  }

  // outline-offsetを表現できていない
  if (chartType === 'line') {
    return colors.map((color, index) => ({
      backgroundColor: color,
      borderColor: color,
      borderDash: BORDER_DASHES[index % BORDER_DASHES.length],
      hoverBorderColor: defaultColor.OUTLINE,
      hoverBorderWidth: 4,
      pointStyle: POINT_STYLES[index % POINT_STYLES.length],
      pointRadius: 8,
    }))
  }
  return colors.map((color, index) => ({
    backgroundColor: index ? draw(SHAPE_TYPES[index % SHAPE_TYPES.length], color) : color,
    borderColor: color,
    hoverBorderColor: defaultColor.OUTLINE,
    hoverBorderWidth: 4,
  }))
}
