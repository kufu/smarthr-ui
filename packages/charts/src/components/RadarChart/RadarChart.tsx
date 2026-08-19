'use client'

import { useId, useMemo, useRef } from 'react'
import { Radar } from 'react-chartjs-2'
import { VisuallyHiddenText } from 'smarthr-ui'

import { createRadarChartOptions, registerChartComponents } from '../../config'
import { getRadarChartColors } from '../../helper'
import { useIntl, useLiveRegionTextFormatter } from '../../intl'

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
  const { localize } = useIntl()
  const formatLiveRegionText = useLiveRegionTextFormatter()
  const chartColors = useMemo(
    () => getRadarChartColors(data.datasets.length),
    [data.datasets.length],
  )

  const ariaLabel = useMemo(() => {
    const counts = {
      datasetCount: data.datasets.length,
      axisCount: data.datasets[0]?.data.length ?? 0,
    }

    // titleの有無で別のメッセージを使う。ひとつの文章として翻訳できるようにするため、
    // チャートの説明とtitleを後から連結していない
    return title
      ? localize(
          {
            id: 'smarthr-ui-charts/RadarChart/ariaLabelWithTitle',
            defaultText: '{title} レーダーチャート {datasetCount}個のデータ {axisCount}個の軸',
          },
          { ...counts, title },
        )
      : localize(
          {
            id: 'smarthr-ui-charts/RadarChart/ariaLabel',
            defaultText: 'レーダーチャート {datasetCount}個のデータ {axisCount}個の軸',
          },
          counts,
        )
  }, [title, data, localize])

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
            formatLiveRegionText,
          },
        },
      }),
    [title, chartId, externalOptions, formatLiveRegionText],
  )

  return (
    <div className="shr-relative shr-h-full shr-w-full">
      <VisuallyHiddenText aria-live="polite" id={chartId}></VisuallyHiddenText>
      <Radar
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
