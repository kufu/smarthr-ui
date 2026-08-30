'use client'

import { useId, useMemo, useRef } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { VisuallyHiddenText } from 'smarthr-ui'

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
}) => {
  const chartId = useId()
  const chartRef = useRef<Chart<'doughnut'>>(null)
  const segmentCount = data.labels?.length ?? data.datasets[0]?.data.length ?? 0
  const chartColors = useMemo(
    () => getChartColors<'doughnut'>(segmentCount, disablePatterns),
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
          title: title ? { display: true, text: title } : { display: false },
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

  return (
    <div className={`shr-relative shr-h-full shr-w-full ${className ?? ''}`}>
      <VisuallyHiddenText aria-live="polite" id={chartId}></VisuallyHiddenText>
      {/* eslint-disable-next-line smarthr/a11y-scroller-has-tabindex */}
      <Doughnut
        // tooltip は canvas の中に描かれるため、position 指定された中央コンテンツより
        // 後ろに隠れてしまう。canvas 自体を前面に上げて中央コンテンツを背面に回す
        className="shr-relative shr-z-1"
        tabIndex={0}
        role="application"
        ref={chartRef}
        data={enhancedData}
        options={chartOptions}
        plugins={plugins}
        aria-label={ariaLabel}
      />
      <DoughnutCenterContent chartArea={chartArea}>{children}</DoughnutCenterContent>
    </div>
  )
}
