import type { Chart } from 'chart.js'

export type KeyboardNavigationOptions = {
  liveRegionId?: string
}

/**
 * のこりの実装
 * - キーボード操作したときにcanvasのフォーカスアウトラインを見えなくする
 */

export const keyboardNavigationPlugin = {
  id: 'keyboardNavigation',
  defaults: {
    liveRegionId: undefined,
  },
  afterInit: (chart: Chart, args: any, options: KeyboardNavigationOptions) => {
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
          nextDataIndex = (nextDataIndex + 1) % dataLength
          break
        case 'ArrowDown':
          nextDatasetIndex = (nextDatasetIndex + 1) % datasets.length
          break
        case 'ArrowLeft':
          nextDataIndex = (nextDataIndex - 1 + dataLength) % dataLength
          break
        case 'ArrowUp':
          nextDatasetIndex = (nextDatasetIndex - 1 + datasets.length) % datasets.length
          break
        case 'Escape':
        case 'Tab':
          nextDatasetIndex = -1
          nextDataIndex = -1
          break
      }

      if (nextDatasetIndex === -1 && nextDataIndex === -1) {
        chart.setActiveElements([])
        chart.tooltip.setActiveElements([], { x: 0, y: 0 })
        chart.update()
        // ライブリージョンのクリア処理
        if (liveRegionElement) {
          liveRegionElement.textContent = ''
          console.log('🚀 ~ Live region cleared')
        }
        return
      }

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

      const datasetLabel = datasets[actualNextDatasetIndex].label
      const label = labels[actualNextDataIndex]
      const value = datasets[actualNextDatasetIndex].data[actualNextDataIndex]
      const liveRegionText = `${datasetLabel} ${label} ${value}`

      if (liveRegionElement) {
        liveRegionElement.textContent = liveRegionText
      } else {
        console.warn('Live region element is null, cannot update text')
      }
    }

    canvas.addEventListener('keydown', handleKeyDown)
  },
}
