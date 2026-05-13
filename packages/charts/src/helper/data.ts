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
