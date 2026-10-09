import { ResizableNodeView } from '@tiptap/core'

import type { ResizableNodeViewDirection } from '@tiptap/core'

/**
 * リサイズハンドルを生成する。標準の `createHandle` + `positionHandle` を再現しつつ、
 * `aria-hidden="true"` を付与してアクセシビリティツリーから除外する。
 *
 * 標準実装ではハンドルが中身のない `<div>` のままアクセシビリティツリーに露出し、
 * VoiceOver 等が画像・動画の選択時に「オブジェクト置換文字」をハンドルの数だけ読み上げてしまう。
 * ハンドルはドラッグ操作専用の装飾要素で意味情報を持たないため除外する。
 *
 * NOTE: `createCustomHandle` を指定すると ResizableNodeView 側の `positionHandle` は
 * スキップされるため、位置指定（top/bottom/left/right）もここで行う必要がある。
 */
export const createResizeHandle = (
  direction: ResizableNodeViewDirection,
  isEditable: () => boolean,
): HTMLElement => {
  const handle = document.createElement('div')

  handle.dataset.resizeHandle = direction
  handle.setAttribute('aria-hidden', 'true')
  handle.style.position = 'absolute'

  // ResizableNodeView がハンドルを外すのは文書の更新時だけで、更新を伴わない setEditable では
  // 残る。NodeView を作り直すと読み込み完了まで画像が消えるため、標準の購読より先に止める
  const stopWhenReadOnly = (e: Event) => {
    if (!isEditable()) e.stopImmediatePropagation()
  }
  handle.addEventListener('mousedown', stopWhenReadOnly)
  handle.addEventListener('touchstart', stopWhenReadOnly)

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
 * 標準はハンドルを文書の更新時にだけ編集可否に合わせて外し・付け直す。更新を伴わない
 * setEditable では付け直されず、読み取り専用の間に更新が入るとハンドルが消えたままになる。
 * 読み取り専用の間は CSS で隠して mousedown も止めるので、外さずに保つ
 */
// @ts-expect-error 標準の private な更新処理を空にする。コンストラクタがこの名前で購読する
export class PersistentHandlesNodeView extends ResizableNodeView {
  private moved = false

  constructor(options: ConstructorParameters<typeof ResizableNodeView>[0]) {
    super(options)

    // 標準は動かさずに離しただけでも表示中の寸法で確定する。max-width で縮んで表示されていると、
    // ハンドルに触れただけで保存値が表示の大きさまで小さくなる
    const commit = this.onCommit
    this.onCommit = (width, height) => {
      const { moved } = this
      this.moved = false

      if (moved) commit(width, height)
    }
  }

  handleEditorUpdate() {}

  // 標準は touchend を購読しないため、タッチでは確定もドラッグ中の状態の解除も起きない
  handleResizeStart(event: MouseEvent | TouchEvent, direction: ResizableNodeViewDirection) {
    // @ts-expect-error 標準の private な処理を呼ぶ
    super.handleResizeStart(event, direction)

    if ('touches' in event) {
      const handleTouchEnd = () => {
        document.removeEventListener('touchend', handleTouchEnd)
        document.removeEventListener('touchcancel', handleTouchEnd)
        // @ts-expect-error 標準の private な処理。標準は touchmove の購読を外さない
        document.removeEventListener('touchmove', this.handleTouchMove)
        // @ts-expect-error 標準の private な処理を呼ぶ
        this.handleMouseUp()
      }

      document.addEventListener('touchend', handleTouchEnd)
      document.addEventListener('touchcancel', handleTouchEnd)
    }
  }

  // 標準はポインタの移動量をそのまま幅に足す。中央寄せでは両端が半分ずつしか動かず、
  // ハンドルがポインタの半分の速さになるため、横の移動量を倍にする
  handleResize(deltaX: number, deltaY: number) {
    // ドラッグ開始で CSS が切り替わると、ポインタが止まっていても移動量 0 の mousemove が届くことがある
    if (deltaX !== 0 || deltaY !== 0) this.moved = true

    const factor = this.node.attrs.align === 'center' ? 2 : 1

    // @ts-expect-error 標準の private な処理を呼ぶ
    super.handleResize(deltaX * factor, deltaY)
  }
}
