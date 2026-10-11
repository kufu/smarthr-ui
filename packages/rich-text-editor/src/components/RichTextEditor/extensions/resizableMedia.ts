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
const createResizeHandle = (
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

type ResizableNodeViewOptions = ConstructorParameters<typeof ResizableNodeView>[0]

type PersistentHandlesNodeViewOptions = Omit<ResizableNodeViewOptions, 'options'> & {
  options?: Omit<NonNullable<ResizableNodeViewOptions['options']>, 'createCustomHandle'>
  onCancel: () => void
  onResizingChange?: (resizing: boolean) => void
  /**
   * 確定時の下限の基準。表示サイズからは求めない。max-width で縮んでいることがあり、
   * 保存された寸法をどう表示に使うか（文字列の扱い・YouTube の 16:9）はメディアごとに違うため
   */
  getOwnSize: () => { width: number; height: number }
}

const NOOP_UPDATE_LISTENER: () => void = Object.assign(() => {}, {
  bind: () => NOOP_UPDATE_LISTENER,
})

/**
 * 標準はハンドルを文書の更新時にだけ編集可否に合わせて外し・付け直す。更新を伴わない
 * setEditable では付け直されず、読み取り専用の間に更新が入るとハンドルが消えたままになる。
 * 読み取り専用の間は CSS で隠して mousedown も止めるので、外さずに保つ
 */
// @ts-expect-error 標準の private な更新処理を空にする。コンストラクタがこの名前で購読する
export class PersistentHandlesNodeView extends ResizableNodeView {
  private moved = false

  private onResizingChange?: (resizing: boolean) => void

  private releaseTouch?: () => void

  private configuredMinSize: { width: number; height: number }

  private getOwnSize: () => { width: number; height: number }

  private minCommitSize = { width: 0, height: 0 }

  constructor({
    editor,
    options,
    onCancel,
    onResizingChange,
    getOwnSize,
    ...rest
  }: PersistentHandlesNodeViewOptions) {
    super({
      ...rest,
      editor,
      options: {
        ...options,
        createCustomHandle: (direction) => createResizeHandle(direction, () => editor.isEditable),
      },
    })

    this.onResizingChange = onResizingChange
    this.getOwnSize = getOwnSize
    this.configuredMinSize = { ...this.minSize }

    // 標準は動かさずに離しただけでも表示中の寸法で確定する。max-width で縮んで表示されていると、
    // ハンドルに触れただけで保存値が表示の大きさまで小さくなる
    const commit = this.onCommit
    this.onCommit = (width, height) => {
      const { moved } = this
      this.moved = false
      this.onResizingChange?.(false)

      if (moved && this.editor.isEditable) {
        const size = this.raiseToMinCommitSize(width, height)
        commit(size.width, size.height)
      } else {
        onCancel()
      }
    }
  }

  updateSize(attributes: { width: number; height: number }) {
    const pos = this.getPos()
    if (pos === undefined) return

    // 下限で元の大きさに戻ったときに、何も変えない変更が onChange と取り消し履歴に残る。
    // 選択は変わらなくても行う。ハンドルの操作で選択されるのはここだけで、結果によって変えない
    const unchanged =
      this.node.attrs.width === attributes.width && this.node.attrs.height === attributes.height

    this.editor
      .chain()
      .setNodeSelection(pos)
      .command(
        ({ commands }) => unchanged || commands.updateAttributes(this.node.type.name, attributes),
      )
      .run()
  }

  // 標準は購読も解除も handleEditorUpdate.bind(this) で行い、bind が毎回別の関数を返すため解除されず、
  // NodeView を作り直すたびに残る。購読そのものは止められないので、bind しても同じ関数を返すものを渡す。
  // インスタンスごとに分けないのは、off が同じ関数をまとめて外しても、何もしない関数なので害が無いため
  get handleEditorUpdate() {
    return NOOP_UPDATE_LISTENER
  }

  // 上流が bind をやめてアロー関数のフィールドにすると、親のコンストラクタが代入して例外になる
  set handleEditorUpdate(_listener: unknown) {}

  // 標準は touchend を購読しないため、タッチでは確定もドラッグ中の状態の解除も起きない
  handleResizeStart(event: MouseEvent | TouchEvent, direction: ResizableNodeViewDirection) {
    // 標準は縦横比を保ったまま幅と高さの両方に最小値を課す。1000×50 のような画像は最初の
    // 移動で高さが最小値まで引き上げられ、幅も 2000 に跳ねる。最初から下回る辺はそれ以上縮めないだけにする。
    // 標準はタッチだと開始の中で最初の寸法計算まで行うため、呼ぶ前に設定する
    const { offsetWidth, offsetHeight } = this.element
    const { width, height } = this.configuredMinSize
    this.minSize = {
      width: offsetWidth > 0 ? Math.min(width, offsetWidth) : width,
      height: offsetHeight > 0 ? Math.min(height, offsetHeight) : height,
    }

    // 確定時は上で下げた最小値を使わない。max-width で縮んで表示されているだけのメディアまで、
    // 最小値を割る大きさで保存されるため。元の大きさを基準にする
    this.minCommitSize = this.computeMinCommitSize(this.getOwnSize())

    // @ts-expect-error 標準の private な処理を呼ぶ
    super.handleResizeStart(event, direction)
    this.onResizingChange?.(true)

    if ('touches' in event) {
      const handleTouchEnd = () => {
        this.releaseTouch?.()
        // @ts-expect-error 標準の private な処理を呼ぶ
        this.handleMouseUp()
      }

      this.releaseTouch = () => {
        this.releaseTouch = undefined
        document.removeEventListener('touchend', handleTouchEnd)
        document.removeEventListener('touchcancel', handleTouchEnd)
        // @ts-expect-error 標準の private な処理。標準は touchmove の購読を外さない
        document.removeEventListener('touchmove', this.handleTouchMove)
      }

      document.addEventListener('touchend', handleTouchEnd)
      document.addEventListener('touchcancel', handleTouchEnd)
    }
  }

  private raiseToMinCommitSize(width: number, height: number) {
    const { minCommitSize } = this

    // 高さでは判定しない。表示の高さは丸めで縦横比から 1px ずれ、下限ちょうどの確定まで寄せてしまう
    return width < minCommitSize.width ? minCommitSize : { width, height }
  }

  private computeMinCommitSize(own: { width: number; height: number }) {
    const { width, height } = this.configuredMinSize

    // 縦横比を保たない設定では下限を当てない。辺ごとに戻すと、ドラッグ中に許した大きさから
    // 離した瞬間に跳ね、Shift で縦横比を保ったドラッグも崩れる。この製品では使わない設定
    if (!this.preserveAspectRatio || !(own.width > 0 && own.height > 0)) {
      return { width: 0, height: 0 }
    }

    const scale = Math.min(1, Math.max(width / own.width, height / own.height))

    return { width: Math.round(own.width * scale), height: Math.round(own.height * scale) }
  }

  // 標準の destroy はマウスの購読しか外さない。タッチでドラッグ中に消えると document に残る
  destroy() {
    this.releaseTouch?.()
    super.destroy()
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
