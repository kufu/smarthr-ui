'use client'

import { useId, useMemo, useRef, useState } from 'react'
import { Radar } from 'react-chartjs-2'
import {
  FaCircleNodesIcon,
  FaTableIcon,
  SegmentedControl,
  Text,
  VisuallyHiddenText,
} from 'smarthr-ui'

import { createRadarChartOptions, registerChartComponents } from '../../config'
import { getRadarChartColors } from '../../helper'
import { useIntl, useLiveRegionTextFormatter } from '../../intl'
import { TableView } from '../internal/TableView/TableView'

import type { ChartViewType } from '../../helper'
import type { Chart, ChartData, ChartOptions } from 'chart.js'

registerChartComponents()

const VIEW_OPTIONS = [
  {
    value: 'chart',
    content: <FaCircleNodesIcon />,
    ariaLabel: 'グラフ',
  },
  {
    value: 'table',
    content: <FaTableIcon />,
    ariaLabel: 'テーブル',
  },
]

type Props = {
  data: ChartData<'radar'>
  title?: string
  options?: Partial<ChartOptions<'radar'>>
  onChangeView?: (value: ChartViewType) => void
  defaultView?: ChartViewType
}

export const RadarChart: React.FC<Props> = ({
  data,
  title,
  options: externalOptions,
  onChangeView,
  defaultView = 'chart',
}) => {
  const [view, setView] = useState<ChartViewType>(defaultView)
  const chartId = useId()
  const chartRef = useRef<Chart<'radar'>>(null)
  const { localize } = useIntl()
  const formatLiveRegionText = useLiveRegionTextFormatter()
  const chartColors = useMemo(
    () => getRadarChartColors(data.datasets.length),
    [data.datasets.length],
  )

  const ariaLabel = useMemo(
    () =>
      localize(
        title
          ? {
              id: 'smarthr-ui-charts/RadarChart/ariaLabelWithTitle',
              defaultText: '{title} レーダーチャート {datasetCount}個のデータ {axisCount}個の軸',
            }
          : {
              id: 'smarthr-ui-charts/RadarChart/ariaLabel',
              defaultText: 'レーダーチャート {datasetCount}個のデータ {axisCount}個の軸',
            },
        {
          title,
          datasetCount: data.datasets.length,
          axisCount: data.datasets[0]?.data.length ?? 0,
        },
      ),
    [title, data, localize],
  )

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
          title: {
            display: false,
          },
          keyboardNavigation: {
            ...externalOptions?.plugins?.keyboardNavigation,
            liveRegionId: chartId,
            formatLiveRegionText,
          },
        },
      }),
    [chartId, externalOptions, formatLiveRegionText],
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
          options={VIEW_OPTIONS}
        />
      </div>
      <div className="shr-relative shr-min-h-0 shr-flex-1">
        {view === 'chart' ? (
          <Radar
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
