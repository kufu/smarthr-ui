import type { Chart } from 'chart.js'

export type LiveRegionTextParts = {
  /** 系列名。data.datasets[].label 由来（例: 正社員） */
  datasetLabel: string
  /** 項目名。data.labels[] 由来（例: 4月） */
  label: string
  /** 選択中の値。data.datasets[].data[] 由来（例: 12） */
  value: string
}

export type KeyboardNavigationOptions = {
  liveRegionId?: string
  /**
   * ライブリージョンに書き込む文言のフォーマッタ
   * 未指定の場合は、半角スペースで連結する
   */
  formatLiveRegionText?: (parts: LiveRegionTextParts) => string
}

type ChartWithKeyboardHandler = {
  _keyboardNavigationHandler?: (event: KeyboardEvent) => void
} & Chart

const toText = (value: unknown): string =>
  value === null || value === undefined ? '' : String(value)

export const resolveLiveRegionText = (
  parts: LiveRegionTextParts,
  format?: (parts: LiveRegionTextParts) => string,
): string =>
  format
    ? format(parts)
    : [parts.datasetLabel, parts.label, parts.value].filter((part) => part !== '').join(' ')

export const keyboardNavigationPlugin = {
  id: 'keyboardNavigation',
  defaults: {
    liveRegionId: undefined,
    formatLiveRegionText: undefined,
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

      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault()
          nextDataIndex = (nextDataIndex + 1) % dataLength
          break
        case 'ArrowDown':
          event.preventDefault()
          nextDatasetIndex = (nextDatasetIndex + 1) % datasets.length
          break
        case 'ArrowLeft':
          event.preventDefault()
          nextDataIndex = (nextDataIndex - 1 + dataLength) % dataLength
          break
        case 'ArrowUp':
          event.preventDefault()
          nextDatasetIndex = (nextDatasetIndex - 1 + datasets.length) % datasets.length
          break
        case 'Escape':
        case 'Tab':
          nextDatasetIndex = -1
          nextDataIndex = -1
          break
      }

      if (nextDatasetIndex === -1 && nextDataIndex === -1) {
        canvas.style.outline = ''
        chart.setActiveElements([])
        chart.tooltip.setActiveElements([], { x: 0, y: 0 })
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
      chart.tooltip.setActiveElements(
        [{ datasetIndex: actualNextDatasetIndex, index: actualNextDataIndex }],
        { x: 0, y: 0 },
      )
      chart.update()

      if (liveRegionElement) {
        // afterInitはチャート生成時の1度しか実行されず、optionsの変更ではchart.updateが走るだけなので、
        // 引数のoptionsを参照すると初期値のまま古くなる。最新の値はchart.optionsから都度読み直す
        const currentOptions: KeyboardNavigationOptions =
          chart.options.plugins?.keyboardNavigation ?? options

        liveRegionElement.textContent = resolveLiveRegionText(
          {
            datasetLabel: toText(datasets[actualNextDatasetIndex].label),
            // labels は ChartData 上で任意（undefined 可）のため、無条件参照で落ちないよう防御する
            label: toText(labels?.[actualNextDataIndex]),
            value: toText(datasets[actualNextDatasetIndex].data[actualNextDataIndex]),
          },
          currentOptions.formatLiveRegionText,
        )
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
