'use client'

import { useId, useMemo, useRef } from 'react'
import { Bar } from 'react-chartjs-2'
import { VisuallyHiddenText } from 'smarthr-ui'

import { createBarChartOptions, registerChartComponents } from '../../config'
import { getChartColors } from '../../helper'
import { useIntl, useLiveRegionTextFormatter } from '../../intl'

import type { Chart, ChartData, ChartOptions } from 'chart.js'

// Chart.jsのコンポーネントをモジュールレベルで登録
registerChartComponents()

type Props = {
  // 色などはpropsで渡せないようにする
  // TODO:もっと簡単なデータの型を作る
  data: ChartData<'bar'>
  title?: string
  options?: Partial<ChartOptions<'bar'>>
  /**
   * 棒グラフの柄を無効化するか
   */
  disablePatterns?: boolean
}

export const BarChart: React.FC<Props> = ({
  data,
  title,
  options: externalOptions,
  disablePatterns,
}) => {
  const chartId = useId()
  const chartRef = useRef<Chart<'bar'>>(null)
  const { localize } = useIntl()
  const formatLiveRegionText = useLiveRegionTextFormatter()
  const chartColors = useMemo(
    () => getChartColors(data.datasets.length, disablePatterns),
    [data.datasets.length, disablePatterns],
  )

  const ariaLabel = useMemo(() => {
    const counts = {
      datasetCount: data.datasets.length,
      barCount: data.datasets[0].data.length,
    }

    // titleの有無で別のメッセージを使う。ひとつの文章として翻訳できるようにするため、
    // チャートの説明とtitleを後から連結していない
    return title
      ? localize(
          {
            id: 'smarthr-ui-charts/BarChart/ariaLabelWithTitle',
            defaultText: '{title} 棒グラフ {datasetCount}個のデータ {barCount}本の棒',
          },
          { ...counts, title },
        )
      : localize(
          {
            id: 'smarthr-ui-charts/BarChart/ariaLabel',
            defaultText: '棒グラフ {datasetCount}個のデータ {barCount}本の棒',
          },
          counts,
        )
  }, [title, data, localize])

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
            formatLiveRegionText,
          },
        },
      }),
    [title, chartId, externalOptions, formatLiveRegionText],
  )

  return (
    <div className="shr-relative shr-h-full shr-w-full">
      <VisuallyHiddenText as="output" role="status" id={chartId}></VisuallyHiddenText>
      <Bar
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
