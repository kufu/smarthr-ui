'use client'

import { useEffect, useMemo } from 'react'
import { Bar } from 'react-chartjs-2'

import { createBarChartOptions, getChartColors, registerChartComponents } from '../../config'

import type { ChartData, ChartOptions } from 'chart.js'

export type BarChartProps = {
  /** チャートデータ */
  // TODO:もっと簡単なデータの型を作る
  data: ChartData<'bar'>
  /** チャートオプション（省略時はデフォルト設定を使用） */
  options?: ChartOptions<'bar'>
  /** チャートの幅 */
  width?: number
  /** チャートの高さ */
  height?: number
}

export const BarChart: React.FC<BarChartProps> = ({ data, options, width, height }) => {
  useEffect(() => {
    // Chart.js の必要な要素を登録
    registerChartComponents()
  }, [])

  const enhancedData: ChartData<'bar'> = useMemo(
    () => ({
      ...data,
      datasets: data.datasets.map((dataset, index) => ({
        ...dataset,
        backgroundColor: dataset.backgroundColor || getChartColors(data.datasets.length)[index],
        borderColor: dataset.borderColor || getChartColors(data.datasets.length)[index],
      })),
    }),
    [data],
  )

  // デフォルトオプションとカスタムオプションをマージ
  const chartOptions: ChartOptions<'bar'> = {
    ...createBarChartOptions(),
    ...options,
  }

  return <Bar data={enhancedData} options={chartOptions} width={width} height={height} />
}
