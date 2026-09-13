import { ResizableNodeView, getRenderedAttributes } from '@tiptap/core'
import { Image } from '@tiptap/extension-image'

import type { NodeViewRendererProps, ResizableNodeViewDirection } from '@tiptap/core'
import type { ImageOptions } from '@tiptap/extension-image'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'

type CustomImageOptions = ImageOptions & {
  /**
   * リサイズ操作を許可するか。NodeView を作る時点で評価する。
   *
   * 標準の resize.enabled は生成時に決め打ちになるため、features から image を
   * 外しても NodeView を作り直すまでハンドルが残る。createNodeViews で作り直したときに
   * 最新の値を読めるよう関数で受ける。
   */
  isResizable: () => boolean
}

const toPositiveNumber = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : null

/**
 * リサイズハンドルを生成する。標準の `createHandle` + `positionHandle` を再現しつつ、
 * `aria-hidden="true"` を付与してアクセシビリティツリーから除外する。
 *
 * 標準実装ではハンドルが中身のない `<div>` のままアクセシビリティツリーに露出し、
 * VoiceOver 等が画像選択時に「オブジェクト置換文字」をハンドルの数だけ読み上げてしまう。
 * ハンドルはドラッグ操作専用の装飾要素で意味情報を持たないため除外する。
 *
 * NOTE: `createCustomHandle` を指定すると ResizableNodeView 側の `positionHandle` は
 * スキップされるため、位置指定（top/bottom/left/right）もここで行う必要がある。
 */
const createResizeHandle = (direction: ResizableNodeViewDirection): HTMLElement => {
  const handle = document.createElement('div')

  handle.dataset.resizeHandle = direction
  handle.setAttribute('aria-hidden', 'true')
  handle.style.position = 'absolute'

  if (direction.includes('top')) handle.style.top = '0'
  if (direction.includes('bottom')) handle.style.bottom = '0'
  if (direction.includes('left')) handle.style.left = '0'
  if (direction.includes('right')) handle.style.right = '0'

  if (direction === 'top' || direction === 'bottom') {
    handle.style.left = '0'
    handle.style.right = '0'
  }
  if (direction === 'left' || direction === 'right') {
    handle.style.top = '0'
    handle.style.bottom = '0'
  }

  return handle
}

/**
 * `@tiptap/extension-image` の標準 NodeView は、`updateAttributes` で alt や
 * width/height を変更しても ProseMirror モデルは更新されるものの、画面上の
 * `<img>` 要素へ反映しない（onUpdate が DOM を同期せず true を返すだけ）。
 * これは upstream issue #7240 / 未マージ PR #7568 と同じ問題。
 *
 * ここでは標準の resizable NodeView を再現しつつ、onUpdate で属性を `<img>` へ
 * 同期するよう修正する。さらに公式 PR でも未対応の width/height（style）まで
 * 同期し、ポップオーバーによるサイズ変更もライブで反映されるようにする。
 *
 * onResize / onCommit / options は標準実装と同一。読み込み完了まで隠す挙動も踏襲するが、
 * 標準に無い onerror を足して失敗時に操作できる状態へ戻す。
 */
export const CustomImage = Image.extend<CustomImageOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as ImageOptions),
      isResizable: () => true,
    }
  },

  addNodeView() {
    if (
      !this.options.resize ||
      !this.options.resize.enabled ||
      !this.options.isResizable() ||
      typeof document === 'undefined'
    ) {
      return null
    }

    const { directions, minWidth, minHeight, alwaysPreserveAspectRatio } = this.options.resize

    return ({ node, getPos, HTMLAttributes, editor }: NodeViewRendererProps) => {
      const el = document.createElement('img')

      Object.entries(HTMLAttributes).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          switch (key) {
            case 'width':
            case 'height':
              break
            default:
              el.setAttribute(key, String(value))
              break
          }
        }
      })
      el.src = HTMLAttributes.src

      // 読み込み失敗の目印を外す。src が変わったときだけ呼ぶ（onUpdate は無関係な
      // 編集でも走るため、毎回外すと壊れたままの画像から目印が消えてしまう）。
      // 実測では属性更新で NodeView ごと作り直されて <img> も新品になるが、
      // 再利用された場合に古い失敗表示が残らないよう保険として持つ。
      const clearLoadFailure = () => {
        delete el.dataset.imageError
      }

      // src を要素へ同期する（空文字/未設定なら属性自体を外す）。公式 PR #7568 準拠。
      const syncImageSource = (src: unknown) => {
        if (typeof src === 'string' && src !== '') {
          if (el.getAttribute('src') !== src) {
            el.src = src
            clearLoadFailure()
          }
        } else {
          if (el.hasAttribute('src')) {
            el.removeAttribute('src')
            clearLoadFailure()
          }
          if (el.src !== '') {
            el.src = ''
          }
        }
      }
      syncImageSource(HTMLAttributes.src)

      let sizeAttributes: { width: unknown; height: unknown } = {
        width: node.attrs.width,
        height: node.attrs.height,
      }

      /**
       * 保存されたサイズを表示へ反映する。幅だけを px で固定し、高さは縦横比に従わせる。
       *
       * width と height の両方を px で固定すると、max-width で表示幅が縮んだときに
       * 高さだけが残って画像が潰れる。ResizableNodeView のコンストラクタが
       * applyInitialSize で px を書くため、生成後にもこれを通す必要がある。
       */
      const applyDisplaySize = () => {
        const width = toPositiveNumber(sizeAttributes.width)
        const height = toPositiveNumber(sizeAttributes.height)
        const naturalRatio =
          el.naturalWidth > 0 && el.naturalHeight > 0 ? el.naturalWidth / el.naturalHeight : null
        // height だけ保存されている既存データは、同じ高さになる幅へ置き換える
        const displayWidth = width ?? (height && naturalRatio ? height * naturalRatio : null)
        const ratio = width && height ? width / height : naturalRatio

        el.style.width = displayWidth ? `${displayWidth}px` : ''
        el.style.height = displayWidth || height ? 'auto' : ''
        el.style.aspectRatio = displayWidth && ratio ? `${ratio}` : ''
      }

      let previousHTMLAttributes: Record<string, unknown> = { ...HTMLAttributes }

      const onUpdate = (updatedNode: ProseMirrorNode) => {
        if (updatedNode.type !== node.type) {
          return false
        }

        const extensionAttributes = editor.extensionManager.attributes.filter(
          (attribute) => attribute.type === updatedNode.type.name,
        )
        const newHTMLAttributes = getRenderedAttributes(updatedNode, extensionAttributes)

        // 直前に存在したが今回無くなった属性を削除（width/height/src は別管理）
        Object.keys(previousHTMLAttributes).forEach((key) => {
          if (key !== 'src' && key !== 'width' && key !== 'height' && !(key in newHTMLAttributes)) {
            el.removeAttribute(key)
          }
        })

        Object.entries(newHTMLAttributes).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            switch (key) {
              case 'src':
              case 'width':
              case 'height':
                break
              default:
                el.setAttribute(key, String(value))
                break
            }
          } else {
            el.removeAttribute(key)
          }
        })

        syncImageSource(newHTMLAttributes.src)

        // 公式 PR でも未対応の width/height を同期し、ポップオーバーでの
        // サイズ変更（updateAttributes に width/height 数値）をライブ反映する。
        sizeAttributes = { width: updatedNode.attrs.width, height: updatedNode.attrs.height }
        applyDisplaySize()

        previousHTMLAttributes = newHTMLAttributes

        return true
      }

      const nodeView = new ResizableNodeView({
        element: el,
        editor,
        node,
        getPos,
        onResize: (width, height) => {
          el.style.width = `${width}px`
          el.style.height = `${height}px`
        },
        onCommit: (width, height) => {
          const pos = getPos()
          if (pos !== undefined) {
            this.editor
              .chain()
              .setNodeSelection(pos)
              .updateAttributes(this.name, { width, height })
              .run()
          }

          // ドラッグ中の px 指定から確定表示の規則へ戻す
          sizeAttributes = { width, height }
          applyDisplaySize()
        },
        onUpdate,
        options: {
          directions,
          min: {
            width: minWidth,
            height: minHeight,
          },
          preserveAspectRatio: alwaysPreserveAspectRatio === true,
          // ハンドルを aria-hidden 化して VoiceOver の重複読み上げを防ぐ
          createCustomHandle: createResizeHandle,
        },
      })

      // コンストラクタの applyInitialSize が width/height を px で書くので上書きする
      applyDisplaySize()

      const dom = nodeView.dom
      dom.style.visibility = 'hidden'
      dom.style.pointerEvents = 'none'

      const revealImage = () => {
        dom.style.visibility = ''
        dom.style.pointerEvents = ''
      }

      el.onload = () => {
        clearLoadFailure()
        // 自然サイズはここで初めて分かる。height だけ保存されている場合に必要
        applyDisplaySize()
        revealImage()
      }

      // 標準実装は onload しか見ていないため、404・期限切れの署名URL・ネットワーク障害で
      // 読み込みに失敗すると永久に不可視かつ pointer-events: none のまま残り、
      // マウスでの選択も削除もできなくなる。失敗しても操作できる状態へ戻す。
      // 目印は属性で付け、見た目（枠線と最小サイズ）は styles.ts のCSSに寄せる。
      // alt テキストは <img> のまま残すので、読み上げ内容は成功時と変わらない。
      el.onerror = () => {
        el.dataset.imageError = 'true'
        revealImage()
      }

      return nodeView
    }
  },
})
