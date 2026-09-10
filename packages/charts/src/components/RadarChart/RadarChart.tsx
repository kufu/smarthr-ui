'use client'

import { useId, useMemo, useRef } from 'react'
import { Radar } from 'react-chartjs-2'
import { VisuallyHiddenText } from 'smarthr-ui'

import { createRadarChartOptions, registerChartComponents } from '../../config'
import { getRadarChartColors } from '../../helper'

import type { Chart, ChartData, ChartOptions } from 'chart.js'

registerChartComponents()

type Props = {
  data: ChartData<'radar'>
  title?: string
  options?: Partial<ChartOptions<'radar'>>
}

export const RadarChart: React.FC<Props> = ({ data, title, options: externalOptions }) => {
  const chartId = useId()
  const chartRef = useRef<Chart<'radar'>>(null)
  const chartColors = useMemo(
    () => getRadarChartColors(data.datasets.length),
    [data.datasets.length],
  )

  const ariaLabel = useMemo(() => {
    const datasetCount = data.datasets.length
    const axisCount = data.datasets[0]?.data.length ?? 0
    const prefix = title ? `${title} ` : ''
    return `${prefix}レーダーチャート ${datasetCount}個のデータ ${axisCount}個の軸`
  }, [title, data])

  const enhancedData: ChartData<'radar'> = useMemo(
    () => ({
      ...data,
      datasets: data.datasets.map((dataset, index) => ({
        ...dataset,
        ...chartColors[index],
      })),
    }),
    [data, chartColors],
  )

  const chartOptions: ChartOptions<'radar'> = useMemo(
    () =>
      createRadarChartOptions({
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
      <VisuallyHiddenText as="output" role="status" id={chartId}></VisuallyHiddenText>
      <Radar
        ref={chartRef}
        role="application"
        data={enhancedData}
        tabIndex={0}
        aria-label={ariaLabel}
        options={chartOptions}
      />
    </div>
  )
}
