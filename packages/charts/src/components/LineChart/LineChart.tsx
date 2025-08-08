'use client'

import { type ReactNode, useEffect, useId, useMemo, useRef, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { VisuallyHiddenText } from 'smarthr-ui'

import { createLineChartOptions, getChartColors, registerChartComponents } from '../../config'

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
  const chartColors = getChartColors<'line'>(data.datasets.length)

  const ariaLabel = useMemo(() => {
    const datasetCount = data.datasets.length
    const pointCount = data.datasets[0].data.length
    return `${title} 線グラフ ${datasetCount}個のデータ ${pointCount}個のポイント`
  }, [title, data])

  useEffect(() => {
    if (chartRef.current?.canvas) {
      chartRef.current.canvas.setAttribute('tabindex', '0')
    }
  }, [])

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
    <>
      <VisuallyHiddenText aria-live="polite" id={chartId}></VisuallyHiddenText>
      <Line
        role="application"
        ref={chartRef}
        data={enhancedData}
        options={chartOptions}
        aria-label={ariaLabel}
      />
    </>
  )
}
