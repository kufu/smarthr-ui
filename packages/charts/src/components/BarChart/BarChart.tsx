'use client'

import { useId, useMemo, useRef, useState } from 'react'
import { Bar } from 'react-chartjs-2'

import type { ReactNode } from 'react'
import {
  VisuallyHiddenText,
  Text,
  SegmentedControl,
  FaTableIcon,
  FaChartColumnIcon,
  FaChartBarIcon,
} from 'smarthr-ui'

import { createBarChartOptions, registerChartComponents } from '../../config'
import { getChartColors } from '../../helper'

import type { SingleToneLevel } from '../../helper'
import type { Chart, ChartData, ChartOptions } from 'chart.js'
import { ChartViewType } from '../../helper/data'
import { TableView } from '../internal/TableView/TableView'

// Chart.jsのコンポーネントをモジュールレベルで登録
registerChartComponents()

/** 棒グラフ固有の配色オプション。Chart から type="bar" のときだけ生やすために切り出している */
export type BarChartColorProps = {
  /**
   * 棒グラフの柄を無効化するか
   */
  disablePatterns?: boolean
  /**
   * 指定すると、系列の色をカテゴリ配色ではなく同系色の濃淡
   * （SINGLE_CHART_COLORS）にする。値は濃淡の範囲
   */
  singleTone?: SingleToneRange
}

/**
 * 濃淡の範囲。第一系列を from、最終系列を to の濃さにして、間を均等に配分する。
 * from > to にすれば第一系列を濃くでき、範囲を狭めれば濃淡差を抑えられる。
 * 範囲の段数より系列が多いと色が重複するので、そのときは柄で見分ける。
 * 系列が1つのときは from と to の濃い側を使う。系列数が変わっても強調される系列の
 * 色が変わらないようにするためで、1系列のときの色を確定させたい場合は
 * from と to を同じ値にする
 */
export type SingleToneRange = {
  from: SingleToneLevel
  to: SingleToneLevel
}

type Props = {
  // 色などはpropsで渡せないようにする
  // TODO:もっと簡単なデータの型を作る
  data: ChartData<'bar'>
  title?: string
  options?: Partial<ChartOptions<'bar'>>
  onChangeView?: (value: ChartViewType) => void
  defaultView?: ChartViewType
  stacked?: boolean
  orientation?: 'horizontal' | 'vertical'
} & BarChartColorProps

type TableData = {
  headers: ReactNode[]
  dataRows: ReactNode[][]
}

export const BarChart: React.FC<Props> = ({
  data,
  title,
  options: externalOptions,
  disablePatterns,
  singleTone,
  onChangeView,
  defaultView = 'chart',
  orientation = 'vertical',
  stacked,
}) => {
  const [view, setView] = useState<ChartViewType>(defaultView)
  const chartId = useId()
  const chartRef = useRef<Chart<'bar'>>(null)
  // 依存配列をプリミティブに保つため、オブジェクトのまま useMemo に渡さない。
  // 呼び出し側が singleTone={{ … }} と書くと毎回別参照になり、柄の再生成が走ってしまう
  const hasSingleTone = !!singleTone
  const singleToneFrom = singleTone?.from
  const singleToneTo = singleTone?.to
  const chartColors = useMemo(
    () =>
      getChartColors(data.datasets.length, {
        disablePatterns,
        singleTone: hasSingleTone,
        toneFrom: singleToneFrom,
        toneTo: singleToneTo,
      }),
    [data.datasets.length, disablePatterns, hasSingleTone, singleToneFrom, singleToneTo],
  )

  const ariaLabel = useMemo(() => {
    const datasetCount = data.datasets.length
    const barCount = data.datasets[0].data.length
    const prefix = title ? `${title} ` : ''
    return `${prefix}棒グラフ ${datasetCount}個のデータ ${barCount}本の棒`
  }, [title, data])

  const enhancedData: ChartData<'bar'> = useMemo(
    () => ({
      ...data,
      datasets: data.datasets.map((dataset, index) => ({
        ...dataset,
        ...chartColors[index],
        ...(stacked && index > 0 ? { borderSkipped: false } : {}),
      })),
    }),
    [data, chartColors, stacked],
  )

  const chartOptions: ChartOptions<'bar'> = useMemo(
    () =>
      createBarChartOptions({
        ...externalOptions,
        ...(orientation === 'horizontal' ? { indexAxis: 'y' } : {}),
        scales: {
          ...externalOptions?.scales,
          ...(stacked
            ? {
                x: { ...externalOptions?.scales?.x, stacked: true },
                y: { ...externalOptions?.scales?.y, stacked: true },
              }
            : {}),
        },
        plugins: {
          ...externalOptions?.plugins,
          title: { display: false },
          keyboardNavigation: {
            liveRegionId: chartId,
            stacked,
            horizontal: orientation === 'horizontal',
          },
        },
      }),
    [chartId, externalOptions, orientation, stacked],
  )

  const handleViewChange = (value: ChartViewType) => {
    setView(value)
    if (onChangeView) {
      onChangeView(value)
    }
  }

  return (
    <div className="shr-relative shr-h-full shr-w-full">
      <VisuallyHiddenText as="output" role="status" id={chartId}></VisuallyHiddenText>
      <div className="shr-grid shr-grid-cols-[1fr_auto_1fr]">
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
              content: orientation === 'horizontal' ? <FaChartBarIcon /> : <FaChartColumnIcon />,
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
      {/* eslint-disable-next-line smarthr/a11y-scroller-has-tabindex */}
      {view === 'chart' ? (
        <Bar
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
  )
}
