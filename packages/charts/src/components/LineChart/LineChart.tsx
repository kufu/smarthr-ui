'use client'

import { useId, useMemo, useRef } from 'react'
import { Line } from 'react-chartjs-2'
import { VisuallyHiddenText } from 'smarthr-ui'

import { createLineChartOptions, registerChartComponents } from '../../config'
import { getLineChartColors } from '../../helper'
import { useIntl, useLiveRegionTextFormatter } from '../../intl'

import type { Chart, ChartData, ChartOptions } from 'chart.js'

// Chart.jsのコンポーネントをモジュールレベルで登録
registerChartComponents()

type Props = {
  // 色などはpropsで渡せないようにする
  // TODO:もっと簡単なデータの型を作る
  data: ChartData<'line'>
  title?: string
  options?: Partial<ChartOptions<'line'>>
}

export const LineChart: React.FC<Props> = ({ data, title, options: externalOptions }) => {
  const chartId = useId()
  const chartRef = useRef<Chart<'line'>>(null)
  const { localize } = useIntl()
  const formatLiveRegionText = useLiveRegionTextFormatter()
  const chartColors = useMemo(
    () => getLineChartColors(data.datasets.length),
    [data.datasets.length],
  )

  const ariaLabel = useMemo(() => {
    const counts = {
      datasetCount: data.datasets.length,
      pointCount: data.datasets[0].data.length,
    }

    // titleの有無で別のメッセージを使う。ひとつの文章として翻訳できるようにするため、
    // チャートの説明とtitleを後から連結していない
    return title
      ? localize(
          {
            id: 'smarthr-ui-charts/LineChart/ariaLabelWithTitle',
            defaultText: '{title} 線グラフ {datasetCount}個のデータ {pointCount}個のポイント',
          },
          { ...counts, title },
        )
      : localize(
          {
            id: 'smarthr-ui-charts/LineChart/ariaLabel',
            defaultText: '線グラフ {datasetCount}個のデータ {pointCount}個のポイント',
          },
          counts,
        )
  }, [title, data, localize])

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
