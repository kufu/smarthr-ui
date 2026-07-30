'use client'

import { useMemo, useState } from 'react'
import { tv } from 'tailwind-variants'

import type { ChartArea, Plugin } from 'chart.js'

type ChartAreaRect = Pick<ChartArea, 'top' | 'left' | 'width' | 'height'>

/**
 * ドーナツの描画領域（chartArea）を追跡する。
 * 凡例やタイトルが表示されると描画領域は canvas の中央から上にずれるため、
 * canvas 全体ではなく chartArea を基準に中央コンテンツを配置する必要がある。
 */
export const useChartAreaTracker = (): {
  chartArea: ChartAreaRect | null
  chartAreaPlugin: Plugin<'doughnut'>
} => {
  const [chartArea, setChartArea] = useState<ChartAreaRect | null>(null)

  const chartAreaPlugin = useMemo<Plugin<'doughnut'>>(
    () => ({
      id: 'chartAreaTracker',
      afterLayout: (chart) => {
        const { top, left, width, height } = chart.chartArea

        // chartArea はオブジェクトなので、参照をそのまま state に入れるとレイアウト
        // ごとに「変化した」と判定され再レンダーが止まらない。数値で比較する。
        setChartArea((prev) =>
          prev &&
          prev.top === top &&
          prev.left === left &&
          prev.width === width &&
          prev.height === height
            ? prev
            : { top, left, width, height },
        )
      },
    }),
    [],
  )

  return { chartArea, chartAreaPlugin }
}

const classNameGenerator = tv({
  base: [
    'shr-pointer-events-none shr-absolute shr-flex shr-flex-col shr-items-center shr-justify-center',
  ],
})

const CENTER_CONTENT_CLASS_NAMES = classNameGenerator()

type Props = {
  /** useChartAreaTracker が返す描画領域。未確定のうちは null */
  chartArea: ChartAreaRect | null
  children?: React.ReactNode
}

export const DoughnutCenterContent: React.FC<Props> = ({ chartArea, children }) => {
  // chartArea が確定する前に描くと canvas の左上に寄った状態が一瞬見えるため、
  // 最初のレイアウトが終わるまで描画しない。
  if (chartArea === null || children === null || children === undefined) {
    return null
  }

  return (
    <div
      className={CENTER_CONTENT_CLASS_NAMES}
      style={{
        top: chartArea.top,
        left: chartArea.left,
        width: chartArea.width,
        height: chartArea.height,
      }}
    >
      {children}
    </div>
  )
}
