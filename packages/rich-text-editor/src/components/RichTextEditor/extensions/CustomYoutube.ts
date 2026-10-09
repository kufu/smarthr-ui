import { nodePasteRule } from '@tiptap/core'
import { DOMSerializer } from '@tiptap/pm/model'
import { Plugin } from '@tiptap/pm/state'

import { parseNumericAttr } from '../serializers/safeAttributes'

import { AlignedYoutube } from './AlignedYoutube'
import { YOUTUBE_ALIGN_STYLES, applyMediaAlign } from './mediaAlign'
import { PersistentHandlesNodeView } from './resizableMedia'
import { YOUTUBE_DEFAULT_SIZE, YOUTUBE_MIN_SIZE, calcYoutubeHeight } from './youtubeOptions'
import { normalizeYoutubeUrl } from './youtubeUrl'

import type { NodeViewRendererProps } from '@tiptap/core'
import type { YoutubeOptions } from '@tiptap/extension-youtube'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import type { EditorView } from '@tiptap/pm/view'

type CustomYoutubeOptions = YoutubeOptions & {
  /**
   * リサイズ操作を許可するか。NodeView を作る時点で評価する。
   * 画像と同じく、features の変更で NodeView を作り直したときに最新の値を読めるよう関数で受ける。
   */
  isResizable: () => boolean
}

// style は NodeView の寸法、tabindex は編集中だけ付けるプラグインが持つ。描画し直した iframe に無いからといって消さない
const UNSYNCED_IFRAME_ATTRIBUTES = new Set(['style', 'tabindex'])

const syncPlayerTabIndex = (view: EditorView) => {
  view.dom.querySelectorAll('div[data-youtube-video] iframe').forEach((iframe) => {
    if (view.editable) {
      iframe.setAttribute('tabindex', '-1')
    } else {
      iframe.removeAttribute('tabindex')
    }
  })
}

const renderVideo = (node: ProseMirrorNode): HTMLElement => {
  const { dom } = DOMSerializer.renderSpec(document, node.type.spec.toDOM!(node))

  return dom as HTMLElement
}

/**
 * 属性が変わったものだけを写す。iframe の src は同じ値でも設定し直すと読み込み直しになり、
 * 再生が止まる。
 */
const syncIframeAttributes = (target: HTMLIFrameElement, source: HTMLIFrameElement) => {
  Array.from(target.attributes).forEach(({ name }) => {
    if (!UNSYNCED_IFRAME_ATTRIBUTES.has(name) && !source.hasAttribute(name)) {
      target.removeAttribute(name)
    }
  })
  Array.from(source.attributes).forEach(({ name, value }) => {
    if (!UNSYNCED_IFRAME_ATTRIBUTES.has(name) && target.getAttribute(name) !== value) {
      target.setAttribute(name, value)
    }
  })
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
      const element = renderVideo(node)
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

      const applyNodeSize = (target: ProseMirrorNode) => {
        const width = parseNumericAttr(target.attrs.width) || YOUTUBE_DEFAULT_SIZE.width
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
          // max-width で縮んだ表示では、読み取った幅が最小幅を下回ることがある
          const committedWidth = Math.max(Math.round(width), YOUTUBE_MIN_SIZE.width)
          const committedHeight = calcYoutubeHeight(committedWidth)

          nodeView.updateSize({ width: committedWidth, height: committedHeight })
          applySize(committedWidth, committedHeight)
        },
        onUpdate: (updatedNode) => {
          if (updatedNode.type !== node.type) return false

          syncIframeAttributes(iframe, renderVideo(updatedNode).querySelector('iframe')!)
          applyNodeSize(updatedNode)
          applyMediaAlign(nodeView.dom, YOUTUBE_ALIGN_STYLES, updatedNode.attrs.align)

          return true
        },
        onCancel: () => applyNodeSize(nodeView.node),
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

  addProseMirrorPlugins() {
    return [
      ...(this.parent?.() ?? []),
      // 編集中に Tab が動画プレーヤーの中を順にたどると、本文の後ろの操作バーや次の入力欄へ
      // 届かない。出力の HTML には残さないよう、属性ではなく描画後の DOM に付ける
      new Plugin({
        view: (editorView) => {
          let editable = editorView.editable
          // Tiptap はプラグインの後に nodeViews を設定して本文を描き直す。文書と編集可否だけを見ると、
          // 描き直しで作られた iframe に付かないまま残る
          let { nodeViews } = editorView.props
          syncPlayerTabIndex(editorView)

          return {
            update: (view, prevState) => {
              if (
                view.state.doc !== prevState.doc ||
                view.editable !== editable ||
                view.props.nodeViews !== nodeViews
              ) {
                editable = view.editable
                nodeViews = view.props.nodeViews
                syncPlayerTabIndex(view)
              }
            },
          }
        },
      }),
    ]
  },
})
