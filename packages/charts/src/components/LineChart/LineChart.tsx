'use client'

import { ReactNode, useId, useMemo, useRef, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  FaTableIcon,
  SegmentedControl,
  VisuallyHiddenText,
  Text,
  FaChartLineIcon,
} from 'smarthr-ui'

import { createLineChartOptions, registerChartComponents } from '../../config'
import { getLineChartColors } from '../../helper'

import type { Chart, ChartData, ChartOptions } from 'chart.js'
import { ChartViewType } from '../../helper/data'
import { TableView } from '../internal/TableView/TableView'

// Chart.jsのコンポーネントをモジュールレベルで登録
registerChartComponents()

type Props = {
  // 色などはpropsで渡せないようにする
  // TODO:もっと簡単なデータの型を作る
  data: ChartData<'line'>
  title?: string
  options?: Partial<ChartOptions<'line'>>
  onChangeView?: (value: ChartViewType) => void
  defaultView?: ChartViewType
}

export const LineChart: React.FC<Props> = ({
  data,
  title,
  options: externalOptions,
  onChangeView,
  defaultView = 'chart',
}) => {
  const [view, setView] = useState<ChartViewType>(defaultView)
  const chartId = useId()
  const chartRef = useRef<Chart<'line'>>(null)
  const chartColors = useMemo(
    () => getLineChartColors(data.datasets.length),
    [data.datasets.length],
  )

  const ariaLabel = useMemo(() => {
    const datasetCount = data.datasets.length
    const pointCount = data.datasets[0].data.length
    const prefix = title ? `${title} ` : ''
    return `${prefix}線グラフ ${datasetCount}個のデータ ${pointCount}個のポイント`
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
        ...externalOptions,
        plugins: {
          ...externalOptions?.plugins,
          title: { display: false },
          keyboardNavigation: {
            liveRegionId: chartId,
          },
        },
      }),
    [title, chartId, externalOptions],
  )

  const handleViewChange = (value: ChartViewType) => {
    setView(value)
    if (onChangeView) {
      onChangeView(value)
    }
  }

  return (
    <div className="shr-flex shr-h-full shr-w-full shr-flex-col">
      <VisuallyHiddenText as="output" role="status" id={chartId}></VisuallyHiddenText>
      <div className="shr-grid shr-shrink-0 shr-grid-cols-[1fr_auto_1fr]">
        <Text as="label" styleType="blockTitle" className="shr-col-start-2 shr-self-center">
          {title}
        </Text>
        <SegmentedControl
          className="shr-col-start-3 shr-justify-self-end [&_button]:shr-p-0.5"
          size="s"
          onClickOption={(value) => handleViewChange(value as ChartViewType)}
          value={view}
          options={[
            {
              value: 'chart',
              content: <FaChartLineIcon />,
              ariaLabel: 'グラフ',
            },
            {
              value: 'table',
              content: <FaTableIcon />,
              ariaLabel: 'テーブル',
            },
          ]}
        />
      </div>
      <div className="shr-relative shr-min-h-0 shr-flex-1">
        {/* eslint-disable-next-line smarthr/a11y-scroller-has-tabindex */}
        {view === 'chart' ? (
          <Line
            ref={chartRef}
            role="application"
            data={enhancedData}
            tabIndex={0}
            aria-label={ariaLabel}
            options={chartOptions}
          />
        ) : (
          <TableView data={enhancedData} options={chartOptions} />
        )}
      </div>
    </div>
  )
}
