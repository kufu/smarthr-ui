'use client'

import { useId, useMemo, useRef } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { VisuallyHiddenText } from 'smarthr-ui'

import { createDoughnutChartOptions, registerChartComponents } from '../../config'
import {
  CUTOUT_BY_THICKNESS,
  SMARTHR_DEFAULT_COLORS,
  getProgressDoughnutColors,
} from '../../helper'
import { roundedProgressPlugin } from '../../plugins'

import type { Chart, ChartData, ChartDataset, ChartOptions, Plugin } from 'chart.js'

// Chart.jsのコンポーネントをモジュールレベルで登録
registerChartComponents()

type Props = {
  /**
   * 進捗と残りの2セグメント。ラベルと値。
   * data[0] = 進捗、data[1] = 残り（トラック）。
   */
  data: {
    labels: [string, string]
    datasets: [{ data: [number, number] }]
  }
  /** アクセシブルネームの元 */
  title?: string
  /** 中央（穴の中）に重ねる内容 */
  children?: React.ReactNode
  /** ドーナツの太さ。既定 'S' */
  thickness?: 'S' | 'M' | 'L'
  /** 進捗色の濃淡。既定は基準色 tone=1 */
  tone?: 0 | 1 | 2 | 3 | 4 | 5
  className?: string
  options?: Partial<ChartOptions<'doughnut'>>
}

export const ProgressDoughnutChart: React.FC<Props> = ({
  data,
  title,
  children,
  thickness = 'S',
  tone = 1,
  className,
  options: externalOptions,
}) => {
  const chartId = useId()
  const chartRef = useRef<Chart<'doughnut'>>(null)
  const colors = useMemo(() => getProgressDoughnutColors(tone), [tone])

  const ariaLabel = useMemo(() => {
    const prefix = title ? `${title} ` : ''
    // 初期フォーカス時点で SR 利用者にも進捗の概要が伝わるよう、data から
    // 「ラベル 値」のサマリを算出して含める（矢印キー操作前でも内容が分かる）。
    const summary = data.labels
      .map((segmentLabel, index) => `${segmentLabel} ${data.datasets[0].data[index]}`)
      .join(' ')
    return `${prefix}ドーナツグラフ ${summary}`
  }, [title, data])

  const chartData: ChartData<'doughnut'> = useMemo(
    () => ({
      labels: data.labels,
      datasets: [
        {
          data: data.datasets[0].data,
          // 進捗（index 0）の塗りは透明にし、見た目は roundedProgressPlugin が
          // 丸端付きの円弧ストロークで描く（hit 判定・キーボードナビ・tooltip は
          // 透明でも arc として残る）。トラック（index 1）は chart.js が描く。
          backgroundColor: [
            'transparent',
            colors.track,
          ] as ChartDataset<'doughnut'>['backgroundColor'],
          hoverBackgroundColor: [
            'transparent',
            colors.track,
          ] as ChartDataset<'doughnut'>['hoverBackgroundColor'],
          // hover 時の枠はセグメント別に指定する。進捗（index 0）は透明にして
          // プラグインが丸端付きの枠を描く（二重描画を避ける）。トラック（index 1）は
          // 角端なので chart.js 標準の枠で強調する。
          hoverBorderColor: [
            'transparent',
            SMARTHR_DEFAULT_COLORS.OUTLINE,
          ] as ChartDataset<'doughnut'>['hoverBorderColor'],
          hoverBorderWidth: 4,
          borderWidth: 0,
          // 枠を arc の内側に描く。既定（center）だと外周の外側にはみ出し、canvas 端
          // ぎりぎりのリングでは hover 枠が見切れるため、inner で内側に寄せて防ぐ。
          borderAlign: 'inner',
        },
      ],
    }),
    [data, colors],
  )

  const chartOptions: ChartOptions<'doughnut'> = useMemo(
    () =>
      createDoughnutChartOptions({
        ...externalOptions,
        cutout: externalOptions?.cutout ?? CUTOUT_BY_THICKNESS[thickness],
        plugins: {
          ...externalOptions?.plugins,
          title: title ? { display: true, text: title } : { display: false },
          legend: { display: false },
          keyboardNavigation: {
            liveRegionId: chartId,
          },
          roundedProgress: {
            segmentIndex: 0,
            color: colors.progress,
            hoverColor: colors.progressHover,
            hoverBorderColor: SMARTHR_DEFAULT_COLORS.OUTLINE,
            hoverBorderWidth: 4,
          },
        },
      }) as ChartOptions<'doughnut'>,
    [title, thickness, chartId, externalOptions, colors],
  )

  return (
    <div className={`shr-relative shr-h-full shr-w-full ${className ?? ''}`}>
      <VisuallyHiddenText aria-live="polite" id={chartId}></VisuallyHiddenText>
      {/* eslint-disable-next-line smarthr/a11y-scroller-has-tabindex */}
      <Doughnut
        tabIndex={0}
        role="application"
        ref={chartRef}
        data={chartData}
        options={chartOptions}
        plugins={[roundedProgressPlugin as Plugin<'doughnut'>]}
        aria-label={ariaLabel}
      />
      {children !== null && children !== undefined && (
        <div
          className="shr-pointer-events-none shr-absolute shr-inset-0 shr-flex shr-flex-col shr-items-center shr-justify-center"
          aria-hidden="true"
        >
          {children}
        </div>
      )}
    </div>
  )
}
