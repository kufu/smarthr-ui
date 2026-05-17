import { draw } from '@smarthr/patternomaly'

import {
  BORDER_DASHES,
  CHART_COLORS,
  POINT_STYLES,
  SHAPE_TYPES,
  SMARTHR_DEFAULT_COLORS,
} from './constants'

import type { ChartDataset, ChartType } from 'chart.js'

const getColor = (index: number) => CHART_COLORS[index % CHART_COLORS.length]

// コントラスト比が保てている色のみ（CHART_COLOR_4, 5, 6, 9, 10）
export const RADAR_CHART_COLORS = [
  CHART_COLORS[3],
  CHART_COLORS[4],
  CHART_COLORS[5],
  CHART_COLORS[8],
  CHART_COLORS[9],
]
const getRadarColor = (index: number) => RADAR_CHART_COLORS[index % RADAR_CHART_COLORS.length]

export const getLineChartColors = (
  dataLength: number,
): Array<
  Pick<
    ChartDataset<'line'>,
    | 'backgroundColor'
    | 'borderColor'
    | 'hoverBorderColor'
    | 'hoverBorderWidth'
    | 'pointStyle'
    | 'pointRadius'
  >
> => {
  const colors: Array<Omit<ChartDataset<'line'>, 'data'>> = []
  for (let i = 0; i < dataLength; i++) {
    const color = getColor(i)
    colors.push({
      backgroundColor: color,
      borderColor: color,
      borderDash: BORDER_DASHES[i % BORDER_DASHES.length],
      hoverBorderColor: SMARTHR_DEFAULT_COLORS.OUTLINE,
      hoverBorderWidth: 4,
      pointStyle: POINT_STYLES[i % POINT_STYLES.length],
      pointRadius: 8,
    })
  }
  return colors
}

const withAlpha = (color: string, alpha: number): string => {
  const rgbMatch = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/)
  if (rgbMatch) {
    return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${alpha})`
  }
  const hexMatch = color.match(/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/)
  if (hexMatch) {
    const hex =
      hexMatch[1].length === 3
        ? hexMatch[1]
            .split('')
            .map((c) => c + c)
            .join('')
        : hexMatch[1]
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }
  return color
}

type RadarChartColorConfig = Pick<
  ChartDataset<'radar'>,
  | 'backgroundColor'
  | 'borderColor'
  | 'hoverBorderColor'
  | 'hoverBorderWidth'
  | 'pointStyle'
  | 'pointRadius'
  | 'fill'
> & { borderDash: number[] }

export const getRadarChartColors = (dataLength: number): RadarChartColorConfig[] => {
  const colors: RadarChartColorConfig[] = []
  for (let i = 0; i < dataLength; i++) {
    const color = getRadarColor(i)
    colors.push({
      backgroundColor: withAlpha(color, 0.2),
      borderColor: color,
      borderDash: [...BORDER_DASHES[i % BORDER_DASHES.length]],
      hoverBorderColor: SMARTHR_DEFAULT_COLORS.OUTLINE,
      hoverBorderWidth: 4,
      pointStyle: POINT_STYLES[i % POINT_STYLES.length],
      pointRadius: 8,
      fill: true,
    })
  }
  return colors
}

// TODO: SINGLE_CHART_COLORS を使うオプションを追加する
export const getChartColors = <T extends Exclude<ChartType, 'line'> = 'bar'>(
  dataLength: number,
): Array<
  Pick<ChartDataset<T>, 'backgroundColor' | 'borderColor' | 'hoverBorderColor' | 'hoverBorderWidth'>
> => {
  const colors: Array<
    Pick<
      ChartDataset<T>,
      'backgroundColor' | 'borderColor' | 'hoverBorderColor' | 'hoverBorderWidth'
    >
  > = []

  for (let i = 0; i < dataLength; i++) {
    const color = getColor(i)
    colors.push({
      backgroundColor: i > 0 ? draw(SHAPE_TYPES[i % SHAPE_TYPES.length], color) : color,
      borderColor: color,
      hoverBorderColor: SMARTHR_DEFAULT_COLORS.OUTLINE,
      hoverBorderWidth: 4,
    })
  }

  return colors
}
