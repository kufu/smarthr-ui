'use client'

import { useId, useMemo, useRef } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { VisuallyHiddenText } from 'smarthr-ui'

import { createDoughnutChartOptions, registerChartComponents } from '../../config'
import { CUTOUT_BY_THICKNESS, DOUGHNUT_SEGMENT_SPACING, getChartColors } from '../../helper'

import type { Chart, ChartData, ChartDataset, ChartOptions } from 'chart.js'

// Chart.jsのコンポーネントをモジュールレベルで登録
registerChartComponents()

type Props = {
  // 色などはpropsで渡せないようにする
  data: ChartData<'doughnut'>
  title?: string
  thickness?: 'S' | 'M' | 'L'
  /**
   * セグメント同士の間隔を空けるかどうか。
   * 隣接する色が直接触れるとコントラストが確保できないため既定で有効。
   */
  withSegmentSpacing?: boolean
  className?: string
  options?: Partial<ChartOptions<'doughnut'>>
}

export const DoughnutChart: React.FC<Props> = ({
  data,
  title,
  thickness = 'M',
  withSegmentSpacing = true,
  className,
  options: externalOptions,
}) => {
  const chartId = useId()
  const chartRef = useRef<Chart<'doughnut'>>(null)
  const segmentCount = data.labels?.length ?? data.datasets[0]?.data.length ?? 0
  const chartColors = useMemo(() => getChartColors<'doughnut'>(segmentCount), [segmentCount])

  const ariaLabel = useMemo(() => {
    const prefix = title ? `${title} ` : ''
    return `${prefix}ドーナツグラフ ${segmentCount}個のセグメント`
  }, [title, segmentCount])

  const enhancedData: ChartData<'doughnut'> = useMemo(
    () => ({
      ...data,
      datasets: data.datasets.map((dataset) => ({
        ...dataset,
        // セグメントが1つだけのときは隙間を空ける相手がおらず、円の始点に切れ込みが
        // 入るだけになるため無効にする。
        spacing: withSegmentSpacing && segmentCount > 1 ? DOUGHNUT_SEGMENT_SPACING : 0,
        backgroundColor: chartColors.map(
          (c) => c.backgroundColor,
        ) as ChartDataset<'doughnut'>['backgroundColor'],
        borderColor: chartColors.map(
          (c) => c.borderColor,
        ) as ChartDataset<'doughnut'>['borderColor'],
        hoverBorderColor: chartColors[0]?.hoverBorderColor,
        hoverBorderWidth: chartColors[0]?.hoverBorderWidth,
      })),
    }),
    [data, chartColors, segmentCount, withSegmentSpacing],
  )

  const chartOptions: ChartOptions<'doughnut'> = useMemo(
    () =>
      createDoughnutChartOptions({
        ...externalOptions,
        cutout: externalOptions?.cutout ?? CUTOUT_BY_THICKNESS[thickness],
        plugins: {
          ...externalOptions?.plugins,
          title: title ? { display: true, text: title } : { display: false },
          keyboardNavigation: {
            liveRegionId: chartId,
          },
        },
      }) as ChartOptions<'doughnut'>,
    [title, thickness, chartId, externalOptions],
  )

  return (
    <div className={`shr-relative shr-h-full shr-w-full ${className ?? ''}`}>
      <VisuallyHiddenText aria-live="polite" id={chartId}></VisuallyHiddenText>
      {/* eslint-disable-next-line smarthr/a11y-scroller-has-tabindex */}
      <Doughnut
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
