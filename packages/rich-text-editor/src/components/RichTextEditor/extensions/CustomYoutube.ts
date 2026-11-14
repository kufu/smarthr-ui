import { nodePasteRule } from '@tiptap/core'

import { parseNumericAttr } from '../serializers/safeAttributes'

import { AlignedYoutube } from './AlignedYoutube'
import { YOUTUBE_ALIGN_STYLES, applyMediaAlign } from './mediaAlign'
import { PersistentHandlesNodeView, renderNodeDOM, syncPlayerAttributes } from './resizableMedia'
import { YOUTUBE_DEFAULT_SIZE, YOUTUBE_MIN_SIZE, calcYoutubeHeight } from './youtubeOptions'
import { normalizeYoutubeUrl } from './youtubeUrl'

import type { NodeViewRendererProps } from '@tiptap/core'
import type { YoutubeOptions } from '@tiptap/extension-youtube'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'

type CustomYoutubeOptions = YoutubeOptions & {
  /**
   * リサイズ操作を許可するか。NodeView を作る時点で評価する。
   * 画像と同じく、features の変更で NodeView を作り直したときに最新の値を読めるよう関数で受ける。
   */
  isResizable: () => boolean
}

/**
 * 標準の貼り付けルールは貼り付けた文字列をそのまま src にするため、
 * 出力側で落ちる表記が保存される。判定の正規表現は拡張のものを使い、src と start を揃える。
 */
export const CustomYoutube = AlignedYoutube.extend<CustomYoutubeOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as YoutubeOptions),
      isResizable: () => true,
    }
  },

  addNodeView() {
    if (!this.options.isResizable() || typeof document === 'undefined') return null

    return ({ node, getPos, editor }: NodeViewRendererProps) => {
      const element = renderNodeDOM(node)
      // 寄せ方は枠に当てる。div に残すと枠の内側で寄って、選択枠線だけが動く
      element.removeAttribute('style')
      const iframe = element.querySelector('iframe')!
      iframe.removeAttribute('style')
      const applySize = (width: number, height: number) => {
        element.style.width = `${width}px`
        element.style.height = ''
        iframe.style.width = '100%'
        iframe.style.height = 'auto'
        iframe.style.aspectRatio = `${width} / ${height}`
      }

      const nodeWidth = (target: ProseMirrorNode) =>
        parseNumericAttr(target.attrs.width) || YOUTUBE_DEFAULT_SIZE.width

      const applyNodeSize = (target: ProseMirrorNode) => {
        const width = nodeWidth(target)
        const height = parseNumericAttr(target.attrs.height) || calcYoutubeHeight(width)

        applySize(width, height)
      }

      const nodeView = new PersistentHandlesNodeView({
        element,
        editor,
        node,
        getPos,
        onResize: (width) => {
          if (editor.isEditable) applySize(width, calcYoutubeHeight(width))
        },
        onCommit: (width) => {
          const committedWidth = Math.round(width)
          const committedHeight = calcYoutubeHeight(committedWidth)

          nodeView.updateSize({ width: committedWidth, height: committedHeight })
          applySize(committedWidth, committedHeight)
        },
        onUpdate: (updatedNode) => {
          if (updatedNode.type !== node.type) return false

          syncPlayerAttributes(iframe, updatedNode)
          applyNodeSize(updatedNode)
          applyMediaAlign(nodeView.dom, YOUTUBE_ALIGN_STYLES, updatedNode.attrs.align)

          return true
        },
        onCancel: () => applyNodeSize(nodeView.node),
        // 高さは幅から 16:9 で決め直すため、保存された高さでは下限を求めない
        getOwnSize: () => {
          const width = nodeWidth(nodeView.node)

          return { width, height: calcYoutubeHeight(width) }
        },
        // ドラッグ中にポインタが iframe に入ると、移動と離す操作を iframe が受け取ってリサイズが止まる
        onResizingChange: (resizing) => {
          iframe.style.pointerEvents = resizing ? 'none' : ''
        },
        options: {
          min: { ...YOUTUBE_MIN_SIZE },
          preserveAspectRatio: true,
        },
      })

      // コンストラクタの applyInitialSize が width/height を px で書くので上書きする
      applyNodeSize(node)
      applyMediaAlign(nodeView.dom, YOUTUBE_ALIGN_STYLES, node.attrs.align)

      return nodeView
    }
  },

  addPasteRules() {
    return (this.parent?.() ?? []).map((rule) =>
      nodePasteRule({
        find: rule.find,
        type: this.type,
        // null を返すと埋め込みにせず文字列のまま貼り付けられる
        getAttributes: (match) => normalizeYoutubeUrl(match.input),
      }),
    )
  },
})
