import { ResizableNodeView, getRenderedAttributes } from '@tiptap/core'
import { Image } from '@tiptap/extension-image'

import type { NodeViewRendererProps, ResizableNodeViewDirection } from '@tiptap/core'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'

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
export const CustomImage = Image.extend({
  addNodeView() {
    if (!this.options.resize || !this.options.resize.enabled || typeof document === 'undefined') {
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

        // 公式 PR でも未対応の width/height を style へ同期し、ポップオーバーでの
        // サイズ変更（updateAttributes に width/height 数値）をライブ反映する。
        // applyInitialSize と同じく、未指定(null)なら '' に戻して自然サイズへ戻す
        // （Reset ボタンのケース）。
        const w = updatedNode.attrs.width
        const h = updatedNode.attrs.height
        el.style.width = w ? `${w}px` : ''
        el.style.height = h ? `${h}px` : ''

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

      const dom = nodeView.dom
      dom.style.visibility = 'hidden'
      dom.style.pointerEvents = 'none'

      const revealImage = () => {
        dom.style.visibility = ''
        dom.style.pointerEvents = ''
      }

      el.onload = () => {
        clearLoadFailure()
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
