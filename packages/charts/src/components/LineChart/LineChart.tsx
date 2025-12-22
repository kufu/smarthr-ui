'use client'

import { useId, useMemo, useRef } from 'react'
import { Line } from 'react-chartjs-2'
import { VisuallyHiddenText } from 'smarthr-ui'

import { createLineChartOptions, registerChartComponents } from '../../config'
import { getLineChartColors } from '../../helper'

import type { Chart, ChartData, ChartOptions } from 'chart.js'

// Chart.jsのコンポーネントをモジュールレベルで登録
registerChartComponents()

type Props = {
  // 色などはpropsで渡せないようにする
  // TODO:もっと簡単なデータの型を作る
  data: ChartData<'line'>
  title: string
}

export const LineChart: React.FC<Props> = ({ data, title }) => {
  const chartId = useId()
  const chartRef = useRef<Chart<'line'>>(null)
  const chartColors = useMemo(
    () => getLineChartColors(data.datasets.length),
    [data.datasets.length],
  )

  const ariaLabel = useMemo(() => {
    const datasetCount = data.datasets.length
    const pointCount = data.datasets[0].data.length
    return `${title} 線グラフ ${datasetCount}個のデータ ${pointCount}個のポイント`
  }, [title, data])

  const enhancedData: ChartData<'line'> = useMemo(
    () => ({
      ...data,
      datasets: data.datasets.map((dataset, index) => ({
        ...dataset,
        ...chartColors[index],
      })),
    }),
    [data, chartColors],
  )

  const chartOptions: ChartOptions<'line'> = useMemo(
    () =>
      createLineChartOptions({
        plugins: {
          title: {
            display: true,
            text: title,
          },
          keyboardNavigation: {
            liveRegionId: chartId,
          },
        },
      }),
    [title, chartId],
  )

  return (
    <div className="shr-relative">
      <VisuallyHiddenText aria-live="polite" id={chartId}></VisuallyHiddenText>
      <Line
        tabIndex={0}
        role="application"
        ref={chartRef}
        data={enhancedData}
        options={chartOptions}
        aria-label={ariaLabel}
      />
    </div>
  )
}
