'use client'

import { useMemo, useRef } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { VisuallyHiddenText } from 'smarthr-ui'

import { createDoughnutChartOptions, registerChartComponents } from '../../config'
import {
  CUTOUT_BY_THICKNESS,
  SMARTHR_DEFAULT_COLORS,
  getProgressDoughnutColors,
} from '../../helper'
import { roundedProgressPlugin } from '../../plugins'
import { DoughnutCenterContent, useChartAreaTracker } from '../DoughnutCenterContent'

import type { Chart, ChartData, ChartDataset, ChartOptions, Plugin, TooltipItem } from 'chart.js'

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
  /**
   * 中央（穴の中）に重ねる内容。
   * 何の進捗かという文脈は見出しなど利用者側で与える（chart.js の title は
   * canvas 上部に文字を描いてドーナツを縮めてしまうため受け取らない）。
   */
  children?: React.ReactNode
  /** ドーナツの太さ。既定 'S' */
  thickness?: 'S' | 'M' | 'L'
  /**
   * 進捗の帯の端を丸くするか。既定 false。
   * 丸端は進捗が極小のときに帯の長さより大きな塊として描かれ、実際の値より
   * 多く見えてしまうため、既定は角端にしている。
   */
  rounded?: boolean
  /** 進捗色の濃淡。既定は基準色 tone=1 */
  tone?: 1 | 2 | 3 | 4 | 5
  className?: string
  options?: Partial<ChartOptions<'doughnut'>>
}

export const ProgressDoughnutChart: React.FC<Props> = ({
  data,
  children,
  thickness = 'S',
  tone = 1,
  rounded = false,
  className,
  options: externalOptions,
}) => {
  const chartRef = useRef<Chart<'doughnut'>>(null)
  const colors = useMemo(() => getProgressDoughnutColors(tone), [tone])
  const { chartArea, chartAreaPlugin } = useChartAreaTracker()

  // 進捗と残りが両方 0 のときの扱いをここに集約する。<progress> は max=0 が不正になり、
  // canvas は chart.js が全セグメントの角度を 0 と計算して進捗もトラックも描かず
  // 空白になる。同じ「合計 0」への対処なので、利用側に [0, 1] を渡させず両方をここで吸収する。
  const { isEmpty, segments, progress } = useMemo(() => {
    const [progressValue, remainingValue] = data.datasets[0].data
    const total = progressValue + remainingValue
    const empty = total <= 0

    return {
      isEmpty: empty,
      // 合計 0 でもトラックだけは見せたいので、残りを 1 とみなして満円のトラックを描かせる
      segments: (empty ? [0, 1] : [progressValue, remainingValue]) as [number, number],
      // 支援技術には円弧ではなく <progress> として見せるため、その属性を data から算出する。
      progress: {
        // 進捗セグメントのラベルが「何の進捗か」を表す（例: インストール済）
        label: data.labels[0],
        max: empty ? 1 : total,
        value: progressValue,
      },
    }
  }, [data])

  const chartData: ChartData<'doughnut'> = useMemo(
    () => ({
      labels: data.labels,
      datasets: [
        {
          data: segments,
          // 丸端のときは進捗（index 0）の塗りを透明にし、見た目は roundedProgressPlugin が
          // 丸端付きの円弧ストロークで描く（hit 判定・キーボードナビ・tooltip は
          // 透明でも arc として残る）。角端のときはプラグインを止めて chart.js に塗らせる。
          // トラック（index 1）は常に chart.js が描く。
          backgroundColor: [
            rounded ? 'transparent' : colors.progress,
            colors.track,
          ] as ChartDataset<'doughnut'>['backgroundColor'],
          hoverBackgroundColor: [
            rounded ? 'transparent' : colors.progressHover,
            colors.track,
          ] as ChartDataset<'doughnut'>['hoverBackgroundColor'],
          // hover 時の枠はセグメント別に指定する。丸端の進捗（index 0）は透明にして
          // プラグインが丸端付きの枠を描く（二重描画を避ける）。角端の進捗と
          // トラック（index 1）は chart.js 標準の枠で強調する。
          hoverBorderColor: [
            rounded ? 'transparent' : SMARTHR_DEFAULT_COLORS.OUTLINE,
            SMARTHR_DEFAULT_COLORS.OUTLINE,
          ] as ChartDataset<'doughnut'>['hoverBorderColor'],
          // 合計 0 のときはトラックしか描かれておらず選べるものがない。tooltip も出さないため、
          // hover の枠だけ出て操作できるように見えるのを避ける。
          hoverBorderWidth: isEmpty ? 0 : 4,
          borderWidth: 0,
          // 枠を arc の内側に描く。既定（center）だと外周の外側にはみ出し、canvas 端
          // ぎりぎりのリングでは hover 枠が見切れるため、inner で内側に寄せて防ぐ。
          borderAlign: 'inner',
        },
      ],
    }),
    [data, segments, isEmpty, rounded, colors],
  )

  const chartOptions: ChartOptions<'doughnut'> = useMemo(
    () =>
      createDoughnutChartOptions({
        ...externalOptions,
        cutout: externalOptions?.cutout ?? CUTOUT_BY_THICKNESS[thickness],
        plugins: {
          ...externalOptions?.plugins,
          title: { display: false },
          legend: { display: false },
          tooltip: {
            // 合計 0 のときは残りを 1 とみなして描いているため、tooltip を出すと実在しない
            // 「残り: 1」を見せてしまう。events を空にする手もあるが、createDoughnutChartOptions
            // の deepmerge が配列を連結するので既定の events が残り、効かない。
            enabled: !isEmpty,
            callbacks: {
              // 丸端のときは進捗（index 0）の塗りを透明にしてプラグインで描いているため、
              // tooltip の色マーカーが透明になってしまう。実際の進捗色／トラック色を返す。
              // 角端のときは chart.js が実色で塗るため本来は不要だが、返す色は同じなので
              // モードでは分岐しない。
              labelColor: (context: TooltipItem<'doughnut'>) => {
                const segmentColor = context.dataIndex === 0 ? colors.progress : colors.track
                return { borderColor: segmentColor, backgroundColor: segmentColor }
              },
            },
          },
          roundedProgress: rounded
            ? {
                segmentIndex: 0,
                color: colors.progress,
                hoverColor: colors.progressHover,
                hoverBorderColor: SMARTHR_DEFAULT_COLORS.OUTLINE,
                hoverBorderWidth: 4,
              }
            : false,
        },
      }) as ChartOptions<'doughnut'>,
    [thickness, rounded, isEmpty, externalOptions, colors],
  )

  // chartAreaPlugin は children の有無に関わらず常に渡す。react-chartjs-2 は plugins を
  // chart 生成時（mount 時）にしか読まないため、children が後から付いたときに追加しても
  // 登録されず、chartArea が null のままで中央コンテンツが出なくなる。
  const plugins = useMemo(
    () => [roundedProgressPlugin as Plugin<'doughnut'>, chartAreaPlugin],
    [chartAreaPlugin],
  )

  return (
    <div className={`shr-relative shr-h-full shr-w-full ${className ?? ''}`}>
      {/*
        このコンポーネントは「グラフ」ではなく「丸くなった <progress>」として扱う。
        そのため円弧の canvas は支援技術から隠し、代わりに視覚的に隠した <progress>
        を見せる（キーボードで円弧を辿る必要がなくなるため tabIndex や
        keyboardNavigation も持たない）。
      */}
      <Doughnut
        ref={chartRef}
        data={chartData}
        plugins={plugins}
        // tooltip は canvas の中に描かれるため、position 指定された中央コンテンツより
        // 後ろに隠れてしまう。canvas 自体を前面に上げて中央コンテンツを背面に回す
        className="shr-relative shr-z-1"
        aria-hidden="true"
        options={chartOptions}
      />
      {/*
        名前は <label> で囲まず aria-label で与える。<label> のテキストは
        「読み上げ順に現れるテキストノード」と「progress のアクセシブルネーム」を
        兼ねてしまい、VoiceOver では停止点が2つに分かれて同じ語を2回聞くことになる。
        割合（65% など）は支援技術が max / value から算出するので持たせない。
      */}
      <VisuallyHiddenText
        as="progress"
        value={progress.value}
        max={progress.max}
        aria-label={progress.label}
      />
      {/*
        中央の内容は進捗を視覚的に言い換えたものなので、<progress> と二重に
        読み上げられないよう支援技術からは隠す。
      */}
      <DoughnutCenterContent chartArea={chartArea} ariaHidden>
        {children}
      </DoughnutCenterContent>
    </div>
  )
}
