'use client'

import { ReactNode, useId, useMemo, useRef, useState } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { FaChartPieIcon, FaTableIcon, SegmentedControl, VisuallyHiddenText, Text } from 'smarthr-ui'

import { createDoughnutChartOptions, registerChartComponents } from '../../config'
import {
  CUTOUT_BY_THICKNESS,
  DOUGHNUT_SEGMENT_DIVIDER_WIDTH,
  SMARTHR_DEFAULT_COLORS,
  getChartColors,
} from '../../helper'
import { doughnutSegmentDividerPlugin } from '../../plugins'
import { DoughnutCenterContent, useChartAreaTracker } from '../DoughnutCenterContent'

import type { Chart, ChartData, ChartDataset, ChartOptions, Plugin } from 'chart.js'
import { ChartViewType } from '../../helper/data'
import { TableView } from '../internal/TableView/TableView'

// Chart.jsのコンポーネントをモジュールレベルで登録
registerChartComponents()

type Props = {
  // 色などはpropsで渡せないようにする
  data: ChartData<'doughnut'>
  title?: string
  thickness?: 'S' | 'M' | 'L'
  /** ドーナツの穴の中央に重ねる内容 */
  children?: React.ReactNode
  className?: string
  options?: Partial<ChartOptions<'doughnut'>>
  onChangeView?: (value: ChartViewType) => void
  defaultView?: ChartViewType
  /**
   * ドーナツグラフの柄を無効化するか
   */
  disablePatterns?: boolean
}

export const DoughnutChart: React.FC<Props> = ({
  data,
  title,
  thickness = 'M',
  children,
  className,
  options: externalOptions,
  disablePatterns,
  onChangeView,
  defaultView = 'chart',
}) => {
  const [view, setView] = useState<ChartViewType>(defaultView)
  const chartId = useId()
  const chartRef = useRef<Chart<'doughnut'>>(null)
  const segmentCount = data.labels?.length ?? data.datasets[0]?.data.length ?? 0
  const chartColors = useMemo(
    () => getChartColors<'doughnut'>(segmentCount, { disablePatterns }),
    [segmentCount, disablePatterns],
  )
  const { chartArea, chartAreaPlugin } = useChartAreaTracker()

  const ariaLabel = useMemo(() => {
    const prefix = title ? `${title} ` : ''
    return `${prefix}ドーナツグラフ ${segmentCount}個の項目`
  }, [title, segmentCount])

  const enhancedData: ChartData<'doughnut'> = useMemo(
    () => ({
      ...data,
      datasets: data.datasets.map((dataset) => ({
        ...dataset,
        backgroundColor: chartColors.map(
          (c) => c.backgroundColor,
        ) as ChartDataset<'doughnut'>['backgroundColor'],
        // 隣接する色が直接触れるとコントラストを確保できず境界が判別しづらいが、
        // borderWidth で枠を付けると輪郭全周に線が乗って外周がぼやけるため、
        // 継ぎ目だけを doughnutSegmentDividerPlugin に描かせる。
        borderWidth: 0,
        hoverBorderColor: chartColors[0]?.hoverBorderColor,
        hoverBorderWidth: chartColors[0]?.hoverBorderWidth,
      })),
    }),
    [data, chartColors],
  )

  const chartOptions: ChartOptions<'doughnut'> = useMemo(
    () =>
      createDoughnutChartOptions({
        ...externalOptions,
        cutout: externalOptions?.cutout ?? CUTOUT_BY_THICKNESS[thickness],
        plugins: {
          ...externalOptions?.plugins,
          title: { display: false },
          keyboardNavigation: {
            liveRegionId: chartId,
          },
          doughnutSegmentDivider: {
            // チャートは Base（WHITE）の上に置かれる前提。BACKGROUND は Base の背後に
            // 敷く色（#f8f7f6）なので、白背景の上では薄い線として残ってしまう。
            color: SMARTHR_DEFAULT_COLORS.WHITE,
            width: DOUGHNUT_SEGMENT_DIVIDER_WIDTH,
          },
        },
      }) as ChartOptions<'doughnut'>,
    [title, thickness, chartId, externalOptions],
  )

  // chartAreaPlugin は children の有無に関わらず常に渡す。react-chartjs-2 は plugins を
  // chart 生成時（mount 時）にしか読まないため、children が後から付いたときに追加しても
  // 登録されず、chartArea が null のままで中央コンテンツが出なくなる。
  const plugins = useMemo(
    () => [doughnutSegmentDividerPlugin as Plugin<'doughnut'>, chartAreaPlugin],
    [chartAreaPlugin],
  )

  const handleViewChange = (value: ChartViewType) => {
    setView(value)
    if (onChangeView) {
      onChangeView(value)
    }
  }

  return (
    <div className={`shr-flex shr-h-full shr-w-full shr-flex-col ${className ?? ''}`}>
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
              content: <FaChartPieIcon />,
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
        {view === 'chart' ? (
          <>
            <Doughnut
              ref={chartRef}
              role="application"
              data={enhancedData}
              plugins={plugins}
              tabIndex={0}
              // tooltip は canvas の中に描かれるため、position 指定された中央コンテンツより
              // 後ろに隠れてしまう。canvas 自体を前面に上げて中央コンテンツを背面に回す
              className="shr-relative shr-z-1"
              aria-label={ariaLabel}
              options={chartOptions}
            />
            <DoughnutCenterContent chartArea={chartArea}>{children}</DoughnutCenterContent>
          </>
        ) : (
          <TableView data={enhancedData} options={chartOptions} />
        )}
      </div>
    </div>
  )
}
