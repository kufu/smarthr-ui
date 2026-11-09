import type { Chart } from 'chart.js'

export type KeyboardNavigationOptions = {
  liveRegionId?: string
  stacked?: boolean
  horizontal?: boolean
  // 0が表示されないグラフ（棒・ドーナツ）で、0の位置に移動しないようにする
  skipZero?: boolean
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
    skipZero: false,
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

      // 表示されない位置は移動先にしない
      const hasValue = (datasetIndex: number, dataIndex: number) => {
        // 未フォーカス(-1)は先頭として扱う
        const value = datasets[Math.max(datasetIndex, 0)]?.data[Math.max(dataIndex, 0)]
        return value !== null && value !== undefined && !(options.skipZero && value === 0)
      }

      // 端を越えたら反対側に回り込む
      const wrapIndex = (index: number, length: number) => ((index % length) + length) % length

      // currentからdelta方向に一周して、条件に合う最初の位置を返す
      const findNext = (
        current: number,
        delta: number,
        length: number,
        isTarget: (index: number) => boolean,
      ) => {
        for (let step = 1; step <= length; step++) {
          const index = wrapIndex(current + delta * step, length)

          if (isTarget(index)) {
            return index
          }
        }

        return current
      }

      // 未フォーカス(-1)から戻る方向に動くときも末尾に着くよう、0から数える
      const startIndex = (index: number, delta: number) => (index === -1 && delta < 0 ? 0 : index)

      const moveData = (delta: number) => {
        event.preventDefault()
        nextDataIndex = wrapIndex(startIndex(nextDataIndex, delta) + delta, dataLength)

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
        nextDatasetIndex = findNext(
          startIndex(nextDatasetIndex, delta),
          delta,
          datasets.length,
          (index) => hasValue(index, nextDataIndex),
        )
      }
      const reset = () => {
        nextDatasetIndex = -1
        nextDataIndex = -1
      }

      // 全ての棒をカテゴリ順・データセット順に一列に並べて移動する
      const compoundMoveDataAndDataset = (delta: number) => {
        event.preventDefault()
        const datasetCount = datasets.length
        const currentPosition =
          nextDataIndex === -1 ? -1 : nextDataIndex * datasetCount + nextDatasetIndex
        const nextPosition = findNext(
          startIndex(currentPosition, delta),
          delta,
          datasetCount * dataLength,
          (position) => hasValue(position % datasetCount, Math.floor(position / datasetCount)),
        )

        nextDataIndex = Math.floor(nextPosition / datasetCount)
        nextDatasetIndex = nextPosition % datasetCount
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
