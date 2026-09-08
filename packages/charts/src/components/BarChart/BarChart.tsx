'use client'

import { useId, useMemo, useRef } from 'react'
import { Bar } from 'react-chartjs-2'
import { VisuallyHiddenText } from 'smarthr-ui'

import { createBarChartOptions, registerChartComponents } from '../../config'
import { getChartColors } from '../../helper'

import type { SingleToneLevel } from '../../helper'
import type { Chart, ChartData, ChartOptions } from 'chart.js'

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
} & BarChartColorProps

export const BarChart: React.FC<Props> = ({
  data,
  title,
  options: externalOptions,
  disablePatterns,
  singleTone,
}) => {
  const chartId = useId()
  const chartRef = useRef<Chart<'bar'>>(null)
  // 依存配列をプリミティブに保つため、オブジェクトのまま useMemo に渡さない。
  // 呼び出し側が singleTone={{ … }} と書くと毎回別参照になり、柄の再生成が走ってしまう
  const chartColors = useMemo(
    () =>
      getChartColors(data.datasets.length, {
        disablePatterns,
        singleTone: Boolean(singleTone),
        toneFrom: singleTone?.from,
        toneTo: singleTone?.to,
      }),
    [data.datasets.length, disablePatterns, singleTone?.from, singleTone?.to],
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
          },
        },
      }),
    [title, chartId, externalOptions],
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
