import { getRenderedAttributes } from '@tiptap/core'

import { IMAGE_ALIGN_STYLES, applyMediaAlign } from '../mediaAlign'
import { PersistentHandlesNodeView } from '../resizableMedia'

import { SafeImage } from './SafeImage'

import type { NodeViewRendererProps } from '@tiptap/core'
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
export const CustomImage = SafeImage.extend<CustomImageOptions>({
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

      // style（寄せ方）は枠に当てる。img に写すと applyDisplaySize の幅の style を上書きする
      Object.entries(HTMLAttributes).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          switch (key) {
            case 'width':
            case 'height':
            case 'style':
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
      // src を外す更新では NodeView が再利用されて onUpdate を通るため、要素に残った
      // 古い失敗表示をここで外す。
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
      const resolveDisplaySize = () => {
        const width = toPositiveNumber(sizeAttributes.width)
        const height = toPositiveNumber(sizeAttributes.height)
        const naturalRatio =
          el.naturalWidth > 0 && el.naturalHeight > 0 ? el.naturalWidth / el.naturalHeight : null
        // height だけ保存されている既存データは、同じ高さになる幅へ置き換える
        const displayWidth = width ?? (height && naturalRatio ? height * naturalRatio : null)
        const ratio = width && height ? width / height : naturalRatio

        return { displayWidth, height, ratio }
      }

      const applyDisplaySize = () => {
        const { displayWidth, height, ratio } = resolveDisplaySize()

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
          if (
            key !== 'src' &&
            key !== 'width' &&
            key !== 'height' &&
            key !== 'style' &&
            !(key in newHTMLAttributes)
          ) {
            el.removeAttribute(key)
          }
        })

        Object.entries(newHTMLAttributes).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            switch (key) {
              case 'src':
              case 'width':
              case 'height':
              case 'style':
                break
              default:
                el.setAttribute(key, String(value))
                break
            }
          } else if (key !== 'style') {
            el.removeAttribute(key)
          }
        })

        syncImageSource(newHTMLAttributes.src)
        if (!el.hasAttribute('src')) handleError()

        // 公式 PR でも未対応の width/height を同期し、ポップオーバーでの
        // サイズ変更（updateAttributes に width/height 数値）をライブ反映する。
        sizeAttributes = { width: updatedNode.attrs.width, height: updatedNode.attrs.height }
        applyDisplaySize()
        applyMediaAlign(nodeView.dom, IMAGE_ALIGN_STYLES, updatedNode.attrs.align)

        previousHTMLAttributes = newHTMLAttributes

        return true
      }

      const nodeView = new PersistentHandlesNodeView({
        element: el,
        editor,
        node,
        getPos,
        onResize: (width, height) => {
          if (editor.isEditable) {
            el.style.width = `${width}px`
            el.style.height = `${height}px`
          }
        },
        onCommit: (width, height) => {
          nodeView.updateSize({ width, height })

          // ドラッグ中の px 指定から確定表示の規則へ戻す
          sizeAttributes = { width, height }
          applyDisplaySize()
        },
        onCancel: applyDisplaySize,
        onUpdate,
        getOwnSize: () => {
          const { displayWidth, ratio } = resolveDisplaySize()

          return displayWidth && ratio
            ? { width: displayWidth, height: displayWidth / ratio }
            : { width: el.naturalWidth, height: el.naturalHeight }
        },
        options: {
          directions,
          min: {
            width: minWidth,
            height: minHeight,
          },
          preserveAspectRatio: alwaysPreserveAspectRatio === true,
        },
      })

      // コンストラクタの applyInitialSize が width/height を px で書くので上書きする
      applyDisplaySize()

      applyMediaAlign(nodeView.dom, IMAGE_ALIGN_STYLES, node.attrs.align)

      const dom = nodeView.dom
      dom.style.visibility = 'hidden'
      dom.style.pointerEvents = 'none'

      const revealImage = () => {
        dom.style.visibility = ''
        dom.style.pointerEvents = ''
      }

      const handleLoad = () => {
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
      const handleError = () => {
        el.dataset.imageError = 'true'
        revealImage()
      }

      el.onload = handleLoad
      el.onerror = handleError

      // src が無いと load も error も届かないので、待たずに失敗として扱う（onUpdate も同じ）。
      // キャッシュ済みの画像も onload は描画のあとに届くため、待つと NodeView を作り直す
      // たびに1フレーム消える。失敗した画像も complete になるので幅で見分ける
      if (!el.hasAttribute('src')) {
        handleError()
      } else if (el.complete && el.naturalWidth > 0) {
        handleLoad()
      }

      return nodeView
    }
  },
})
