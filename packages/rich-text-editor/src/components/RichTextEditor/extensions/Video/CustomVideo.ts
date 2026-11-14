import { parseNumericAttr } from '../../serializers/safeAttributes'
import { VIDEO_ALIGN_STYLES, applyMediaAlign } from '../mediaAlign'
import { PersistentHandlesNodeView, renderNodeDOM, syncPlayerAttributes } from '../resizableMedia'

import { Video } from './Video'

import type { NodeViewRendererProps } from '@tiptap/core'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'

type CustomVideoOptions = {
  /**
   * リサイズ操作を許可するか。NodeView を作る時点で評価する。
   * 画像と同じく、features の変更で NodeView を作り直したときに最新の値を読めるよう関数で受ける。
   */
  isResizable: () => boolean
}

type Size = { width: number; height: number }

export const VIDEO_MIN_SIZE: Size = { width: 100, height: 100 }

export const CustomVideo = Video.extend<CustomVideoOptions>({
  addOptions() {
    return {
      isResizable: () => true,
    }
  },

  addNodeView() {
    if (!this.options.isResizable() || typeof document === 'undefined') return null

    return ({ node, getPos, editor }: NodeViewRendererProps) => {
      const element = renderNodeDOM(node)
      // 寄せ方は枠に当てる。div に残すと枠の内側で寄って、選択枠線だけが動く
      element.removeAttribute('style')
      const video = element.querySelector('video')!
      video.removeAttribute('style')

      const ratioOf = (target: ProseMirrorNode): Size | null => {
        const width = parseNumericAttr(target.attrs.width)
        const height = parseNumericAttr(target.attrs.height)

        if (width && height) return { width, height }

        return video.videoWidth > 0 && video.videoHeight > 0
          ? { width: video.videoWidth, height: video.videoHeight }
          : null
      }

      const applySize = (width: number | undefined, ratio: Size | null) => {
        element.style.width = width ? `${width}px` : ''
        element.style.height = ''
        video.style.width = width ? '100%' : ''
        video.style.aspectRatio = ratio ? `${ratio.width} / ${ratio.height}` : ''
      }

      const applyNodeSize = (target: ProseMirrorNode) =>
        applySize(parseNumericAttr(target.attrs.width), ratioOf(target))

      const nodeView = new PersistentHandlesNodeView({
        element,
        editor,
        node,
        getPos,
        onResize: (width, height) => {
          if (editor.isEditable) applySize(width, ratioOf(nodeView.node) ?? { width, height })
        },
        onCommit: (width) => {
          const ratio = ratioOf(nodeView.node)
          const committedWidth = Math.round(width)
          // 比率が分からないうちに枠の比率で高さを補わないのは、枠が読み込み前の video の既定の
          // 300×150 で、その 2:1 が保存されると読み込んだ後も動画の比率で表示されないため
          const committed = ratio
            ? {
                width: committedWidth,
                height: Math.round((committedWidth * ratio.height) / ratio.width),
              }
            : null

          nodeView.updateSize(committed ?? { width: committedWidth, height: null })
          applySize(committedWidth, committed)
        },
        onUpdate: (updatedNode) => {
          if (updatedNode.type !== node.type) return false

          syncPlayerAttributes(video, updatedNode)
          applyNodeSize(updatedNode)
          applyMediaAlign(nodeView.dom, VIDEO_ALIGN_STYLES, updatedNode.attrs.align)

          return true
        },
        onCancel: () => applyNodeSize(nodeView.node),
        getOwnSize: (): Size => {
          const ratio = ratioOf(nodeView.node)
          const width: number = parseNumericAttr(nodeView.node.attrs.width) ?? video.videoWidth

          return ratio && width > 0
            ? { width, height: (width * ratio.height) / ratio.width }
            : { width: 0, height: 0 }
        },
        // ドラッグ中にポインタが video に入ると、移動と離す操作を video が受け取ってリサイズが止まる
        onResizingChange: (resizing) => {
          video.style.pointerEvents = resizing ? 'none' : ''
        },
        options: {
          min: { ...VIDEO_MIN_SIZE },
          preserveAspectRatio: true,
        },
      })

      // コンストラクタの applyInitialSize が width/height を px で書くので上書きする
      applyNodeSize(node)
      applyMediaAlign(nodeView.dom, VIDEO_ALIGN_STYLES, node.attrs.align)
      video.addEventListener('loadedmetadata', () => applyNodeSize(nodeView.node))

      return nodeView
    }
  },
})
