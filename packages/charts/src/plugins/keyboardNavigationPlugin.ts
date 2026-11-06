import type { Chart } from 'chart.js'

export type KeyboardNavigationOptions = {
  liveRegionId?: string
  stacked?: boolean
  horizontal?: boolean
}

type ChartWithKeyboardHandler = {
  _keyboardNavigationHandler?: (event: KeyboardEvent) => void
} & Chart

export const keyboardNavigationPlugin = {
  id: 'keyboardNavigation',
  defaults: {
    liveRegionId: undefined,
    stacked: false,
    horizontal: false,
  },
  afterInit: (chart: ChartWithKeyboardHandler, args: any, options: KeyboardNavigationOptions) => {
    const { canvas } = chart

    let liveRegionElement: HTMLElement | null = null
    // ライブリージョンの要素を取得
    if (options.liveRegionId) {
      liveRegionElement = document.getElementById(options.liveRegionId)
      if (!liveRegionElement) {
        console.warn(`Live region element with id "${options.liveRegionId}" not found`)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (document.activeElement !== canvas) {
        return
      }
      const activeElements = chart.getActiveElements()

      // 商品A, 商品B, 商品Cみたいな
      const { datasets, labels } = chart.data

      // 棒グラフが何本か
      const dataLength = datasets[0].data.length

      let nextDatasetIndex = activeElements.length > 0 ? activeElements[0].datasetIndex : -1
      let nextDataIndex = activeElements.length > 0 ? activeElements[0].index : -1

      // 値がnullの位置は棒がないので移動先にしない
      const hasValue = (datasetIndex: number, dataIndex: number) => {
        // 未フォーカス(-1)は先頭として扱う
        const value = datasets[Math.max(datasetIndex, 0)]?.data[Math.max(dataIndex, 0)]
        return value !== null && value !== undefined
      }

      const stepData = (delta: number) => {
        nextDataIndex = (nextDataIndex + delta + dataLength) % dataLength
      }
      const stepDataset = (delta: number) => {
        nextDatasetIndex = (nextDatasetIndex + delta + datasets.length) % datasets.length
      }
      // 全部nullでも止まるようにmaxStepsで打ち切る
      const stepUntilValue = (step: () => void, maxSteps: number) => {
        for (let i = 0; i < maxSteps; i++) {
          step()

          if (hasValue(nextDatasetIndex, nextDataIndex)) {
            return
          }
        }
      }

      const moveData = (delta: number) => {
        event.preventDefault()
        stepData(delta)

        // 移動先に値がなければ、値を持つ最初のデータセットにする
        if (!hasValue(nextDatasetIndex, nextDataIndex)) {
          const datasetIndex = datasets.findIndex((_, index) => hasValue(index, nextDataIndex))

          if (datasetIndex !== -1) {
            nextDatasetIndex = datasetIndex
          }
        }
      }
      const moveDataset = (delta: number) => {
        event.preventDefault()
        stepUntilValue(() => stepDataset(delta), datasets.length)
      }
      const reset = () => {
        nextDatasetIndex = -1
        nextDataIndex = -1
      }

      const compoundMoveDataAndDataset = (delta: number) => {
        event.preventDefault()
        stepUntilValue(() => {
          // データとデータセットの境界に到達したかどうかを判定
          const atBoundary =
            delta > 0 ? nextDatasetIndex === datasets.length - 1 : nextDatasetIndex === 0

          if (atBoundary) {
            stepData(delta)
            nextDatasetIndex = delta > 0 ? 0 : datasets.length - 1
          } else {
            stepDataset(delta)
          }
        }, datasets.length * dataLength)
      }

      const defaultBindings: Record<string, () => void> = {
        Escape: reset,
        Tab: reset,
      }

      const bindings: Record<string, () => void> = options.horizontal
        ? options.stacked
          ? {
              ...defaultBindings,
              ArrowDown: () => moveData(1),
              ArrowUp: () => moveData(-1),
              ArrowRight: () => moveDataset(1),
              ArrowLeft: () => moveDataset(-1),
            }
          : {
              ...defaultBindings,
              ArrowDown: () => compoundMoveDataAndDataset(1),
              ArrowUp: () => compoundMoveDataAndDataset(-1),
            }
        : options.stacked
          ? {
              ...defaultBindings,
              ArrowRight: () => moveData(1),
              ArrowLeft: () => moveData(-1),
              ArrowDown: () => moveDataset(-1),
              ArrowUp: () => moveDataset(1),
            }
          : {
              ...defaultBindings,
              ArrowRight: () => compoundMoveDataAndDataset(1),
              ArrowLeft: () => compoundMoveDataAndDataset(-1),
            }

      bindings[event.key]?.()

      if (nextDatasetIndex === -1 && nextDataIndex === -1) {
        canvas.style.outline = ''
        chart.setActiveElements([])
        chart.tooltip?.setActiveElements([], { x: 0, y: 0 })
        chart.update()
        // ライブリージョンのクリア処理
        if (liveRegionElement) {
          liveRegionElement.textContent = ''
        }
        return
      }

      // キーボードナビゲーション中はcanvas要素のアウトラインを非表示にしている
      canvas.style.outline = 'none'

      const actualNextDatasetIndex = Math.max(nextDatasetIndex, 0)
      const actualNextDataIndex = Math.max(nextDataIndex, 0)
      chart.setActiveElements([
        { datasetIndex: actualNextDatasetIndex, index: actualNextDataIndex },
      ])
      chart.tooltip?.setActiveElements(
        [{ datasetIndex: actualNextDatasetIndex, index: actualNextDataIndex }],
        { x: 0, y: 0 },
      )
      chart.update()

      if (liveRegionElement) {
        const datasetLabel = datasets[actualNextDatasetIndex].label
        // labels は ChartData 上で任意（undefined 可）のため、無条件参照で落ちないよう防御する
        const label = labels?.[actualNextDataIndex]
        const value = datasets[actualNextDatasetIndex].data[actualNextDataIndex]
        // datasetLabel（系列名）や label（項目名）が無いチャート（例: 系列名を持たない
        // ProgressDoughnutChart）でも "undefined" を読み上げないよう、空要素を除いて連結する。
        // value は 0 も有効な値のため除外しない。
        const liveRegionText = [datasetLabel, label, value]
          .filter((part) => part !== null && part !== undefined && part !== '')
          .join(' ')
        liveRegionElement.textContent = liveRegionText
      } else {
        console.warn('Live region element is null, cannot update text')
      }
    }

    canvas.addEventListener('keydown', handleKeyDown)

    chart._keyboardNavigationHandler = handleKeyDown
  },

  beforeDestroy: (chart: ChartWithKeyboardHandler) => {
    const { canvas } = chart
    if (chart._keyboardNavigationHandler && canvas) {
      canvas.removeEventListener('keydown', chart._keyboardNavigationHandler)
    }
  },
}
