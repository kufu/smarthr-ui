'use client'

import { useId, useMemo, useRef, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  FaChartLineIcon,
  FaTableIcon,
  SegmentedControl,
  Text,
  VisuallyHiddenText,
} from 'smarthr-ui'

import { createLineChartOptions, registerChartComponents } from '../../config'
import { getLineChartColors } from '../../helper'
import { useIntl, useLiveRegionTextFormatter } from '../../intl'
import { TableView } from '../internal/TableView/TableView'

import type { ChartViewType } from '../../helper'
import type { Chart, ChartData, ChartOptions } from 'chart.js'

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
  const { localize } = useIntl()
  const formatLiveRegionText = useLiveRegionTextFormatter()
  const chartColors = useMemo(
    () => getLineChartColors(data.datasets.length),
    [data.datasets.length],
  )

  const ariaLabel = useMemo(
    () =>
      localize(
        title
          ? {
              id: 'smarthr-ui-charts/LineChart/ariaLabelWithTitle',
              defaultText: '{title} 線グラフ {datasetCount}個のデータ {pointCount}個のポイント',
            }
          : {
              id: 'smarthr-ui-charts/LineChart/ariaLabel',
              defaultText: '線グラフ {datasetCount}個のデータ {pointCount}個のポイント',
            },
        { title, datasetCount: data.datasets.length, pointCount: data.datasets[0].data.length },
      ),
    [title, data, localize],
  )

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
            ...externalOptions?.plugins?.keyboardNavigation,
            liveRegionId: chartId,
            formatLiveRegionText,
          },
        },
      }),
    [chartId, externalOptions, formatLiveRegionText],
  )

  const viewOptions = useMemo(
    () => [
      {
        value: 'chart',
        content: <FaChartLineIcon />,
        ariaLabel: localize({ id: 'smarthr-ui-charts/viewOptions/chart', defaultText: 'グラフ' }),
      },
      {
        value: 'table',
        content: <FaTableIcon />,
        ariaLabel: localize({ id: 'smarthr-ui-charts/viewOptions/table', defaultText: 'テーブル' }),
      },
    ],
    [localize],
  )

  const handleViewChange = (value: string) => {
    setView(value as ChartViewType)
    onChangeView?.(value as ChartViewType)
  }

  return (
    <div className="shr-flex shr-h-full shr-w-full shr-flex-col">
      <VisuallyHiddenText as="output" role="status" id={chartId}></VisuallyHiddenText>
      <div className="shr-grid shr-shrink-0 shr-grid-cols-[1fr_auto_1fr]">
        {title && (
          <Text styleType="blockTitle" className="shr-col-start-2 shr-self-center">
            {title}
          </Text>
        )}
        <SegmentedControl
          value={view}
          size="S"
          className="shr-col-start-3 shr-justify-self-end"
          onClickOption={handleViewChange}
          options={viewOptions}
        />
      </div>
      <div className="shr-relative shr-min-h-0 shr-flex-1">
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
          <TableView data={enhancedData} caption={title} options={chartOptions} />
        )}
      </div>
    </div>
  )
}
