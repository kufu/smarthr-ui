'use client'

import { useId, useMemo, useRef } from 'react'
import { Bar } from 'react-chartjs-2'
import { VisuallyHiddenText } from 'smarthr-ui'

import { createBarChartOptions, registerChartComponents } from '../../config'
import { getChartColors } from '../../helper'

import type { Chart, ChartData, ChartOptions } from 'chart.js'

// Chart.jsのコンポーネントをモジュールレベルで登録
registerChartComponents()

type Props = {
  // 色などはpropsで渡せないようにする
  // TODO:もっと簡単なデータの型を作る
  data: ChartData<'bar'>
  title?: string
  options?: Partial<ChartOptions<'bar'>>
}

export const BarChart: React.FC<Props> = ({ data, title, options: externalOptions }) => {
  const chartId = useId()
  const chartRef = useRef<Chart<'bar'>>(null)
  const chartColors = useMemo(() => getChartColors(data.datasets.length), [data.datasets.length])

  const ariaLabel = useMemo(() => {
    const datasetCount = data.datasets.length
    const barCount = data.datasets[0].data.length
    const prefix = title ? `${title} ` : ''
    return `${prefix}棒グラフ ${datasetCount}個のデータ ${barCount}本の棒`
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
        ...externalOptions,
        plugins: {
          ...externalOptions?.plugins,
          title: title
            ? {
                display: true,
                text: title,
              }
            : {
                display: false,
              },
          keyboardNavigation: {
            liveRegionId: chartId,
          },
        },
      }),
    [title, chartId, externalOptions],
  )

  return (
    <div className="shr-relative shr-h-full shr-w-full">
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
