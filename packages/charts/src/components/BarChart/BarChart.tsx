'use client'

import { useId, useMemo, useRef } from 'react'
import { Bar } from 'react-chartjs-2'
import { VisuallyHiddenText } from 'smarthr-ui'

import { createBarChartOptions, getChartColors, registerChartComponents } from '../../config'

import type { Chart, ChartData, ChartOptions } from 'chart.js'

// Chart.jsのコンポーネントをモジュールレベルで登録
registerChartComponents()

type Props = {
  // 色などはpropsで渡せないようにする
  // TODO:もっと簡単なデータの型を作る
  data: ChartData<'bar'>
  title: string
}

export const BarChart: React.FC<Props> = ({ data, title }) => {
  const chartId = useId()
  const chartRef = useRef<Chart<'bar'>>(null)
  const chartColors = useMemo(() => getChartColors(data.datasets.length), [data.datasets.length])

  const ariaLabel = useMemo(() => {
    const datasetCount = data.datasets.length
    const barCount = data.datasets[0].data.length
    return `${title} 棒グラフ ${datasetCount}個のデータ ${barCount}本の棒`
  }, [title, data])

  const enhancedData: ChartData<'bar'> = useMemo(
    () => ({
      ...data,
      datasets: data.datasets.map((dataset, index) => ({
        ...dataset,
        ...chartColors[index],
      })),
    }),
    [data, chartColors],
  )

  const chartOptions: ChartOptions<'bar'> = useMemo(
    () =>
      createBarChartOptions({
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
      <Bar
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
