'use client'

import { type ReactNode, useEffect, useId, useMemo, useRef, useState } from 'react'
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
  const chartColors = getChartColors(data.datasets.length)
  const ariaLabel = `${title} 棒グラフ ${data.datasets.length}個のデータ ${data.datasets[0].data.length}本の棒`

  useEffect(() => {
    if (chartRef.current?.canvas) {
      chartRef.current.canvas.setAttribute('tabindex', '0')
    }
  }, [])

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
    <>
      <VisuallyHiddenText aria-live="polite" id={chartId}></VisuallyHiddenText>
      <Bar
        role="application"
        ref={chartRef}
        data={enhancedData}
        options={chartOptions}
        aria-label={ariaLabel}
      />
    </>
  )
}
