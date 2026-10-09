import { nodePasteRule } from '@tiptap/core'
import { DOMSerializer } from '@tiptap/pm/model'
import { Plugin } from '@tiptap/pm/state'

import { parseNumericAttr } from '../serializers/safeAttributes'

import { AlignedYoutube } from './AlignedYoutube'
import { YOUTUBE_ALIGN_STYLES, getMediaAlignStyles } from './mediaAlign'
import { PersistentHandlesNodeView, createResizeHandle } from './resizableMedia'
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

// 編集中だけ付けるプラグインの管理なので、描画し直した iframe に無いからといって消さない
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
      // プラグインは文書か編集可否が変わったときにしか付け直さない。Tiptap はプラグインの後に
      // nodeViews を設定して描き直すため、そこで作られた iframe には付かないまま残る
      if (editor.isEditable) iframe.setAttribute('tabindex', '-1')

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

      const applyAlign = (align: unknown) => {
        const styles = getMediaAlignStyles(YOUTUBE_ALIGN_STYLES, align) ?? {}
        nodeView.dom.style.marginLeft = styles.marginLeft ?? ''
        nodeView.dom.style.marginRight = styles.marginRight ?? ''
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
          if (!editor.isEditable) {
            applyNodeSize(nodeView.node)
            return
          }

          // max-width で縮んだ表示では、読み取った幅が最小幅を下回ることがある
          const committedWidth = Math.max(Math.round(width), YOUTUBE_MIN_SIZE.width)
          const committedHeight = calcYoutubeHeight(committedWidth)
          const pos = getPos()

          if (pos !== undefined) {
            this.editor
              .chain()
              .setNodeSelection(pos)
              .updateAttributes(this.name, { width: committedWidth, height: committedHeight })
              .run()
          }

          applySize(committedWidth, committedHeight)
        },
        onUpdate: (updatedNode) => {
          if (updatedNode.type !== node.type) return false

          syncIframeAttributes(iframe, renderVideo(updatedNode).querySelector('iframe')!)
          applyNodeSize(updatedNode)
          applyAlign(updatedNode.attrs.align)

          return true
        },
        options: {
          min: { ...YOUTUBE_MIN_SIZE },
          preserveAspectRatio: true,
          createCustomHandle: (direction) => createResizeHandle(direction, () => editor.isEditable),
        },
      })

      // コンストラクタの applyInitialSize が width/height を px で書くので上書きする
      applyNodeSize(node)
      applyAlign(node.attrs.align)

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
          syncPlayerTabIndex(editorView)

          return {
            update: (view, prevState) => {
              if (view.state.doc !== prevState.doc || view.editable !== editable) {
                editable = view.editable
                syncPlayerTabIndex(view)
              }
            },
          }
        },
      }),
    ]
  },
})
