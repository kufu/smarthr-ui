import {
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import { DRAWER_TRANSITION_DURATION } from './drawerTransition'

// ドラッグ終了後の投影距離（速度 × この係数 だけ進むと仮定）
const VELOCITY_PROJECTION_MS = 100

// 最後の pointermove からこの時間が経つと、離した時点の速度を 0 とみなす
const VELOCITY_DECAY_MS = 100

const CLOSE_VELOCITY_THRESHOLD = 0.5 // px/ms

export type DragResolution = { type: 'open' } | { type: 'close' }

type DecayVelocityArgs = {
  /** 最後の pointermove で観測した速度(px/ms) */
  velocity: number
  /** 最後の pointermove から離すまでの経過時間(ms) */
  idleMs: number
  /** 速度が 0 とみなされるまでの時間(ms) */
  decayMs: number
}

/**
 * 離した時点の速度を、最後に動いてからの経過時間で線形に減衰させる。
 * 観測値をそのまま使うと、勢いよく動かして静止してから離したときに
 * フリック扱いになってしまうため。
 */
export const decayVelocity = ({ velocity, idleMs, decayMs }: DecayVelocityArgs) =>
  velocity * Math.max(0, 1 - idleMs / decayMs)

type ResolveDragEndArgs = {
  /** 全開時のサイズ(px) */
  fullSize: number
  /** ドラッグ終了時点の開きサイズ(px) */
  currentSize: number
  /** px/ms。正=開く方向、負=閉じる方向 */
  velocity: number
  /** 閉じフリックと判定する速度の大きさ(px/ms) */
  closeThreshold: number
}

export const resolveDragEnd = ({
  fullSize,
  currentSize,
  velocity,
  closeThreshold,
}: ResolveDragEndArgs): DragResolution => {
  // 閉じ方向の強いフリックは位置によらず閉じる
  if (velocity < -closeThreshold) return { type: 'close' }

  // 速度を加味した投影位置が半分を下回るなら閉じる
  if (currentSize + velocity * VELOCITY_PROJECTION_MS < fullSize / 2) return { type: 'close' }

  return { type: 'open' }
}

type UseDrawerDragArgs = {
  /** 全開サイズを実測する対象（grabber を持つパネル自身） */
  targetRef: RefObject<HTMLElement>
  /** 開いているかどうか（閉→開で内部状態をリセットする） */
  isOpen: boolean
  onClose?: () => void
}

export const useDrawerDrag = ({ targetRef, isOpen, onClose }: UseDrawerDragArgs) => {
  // 閉じ方向への符号付きドラッグオフセット(px)。0=全開位置 / fullSize=閉じ位置
  const [dragOffset, setDragOffset] = useState(0)
  // ドラッグ中はトランジションを切り、指に追従させるために state で持つ
  const [isDragging, setIsDragging] = useState(false)

  // pointerdown のたびに測り直すパネルの実寸(px)。
  // ビューポートの回転やコンテナのリサイズで全開サイズは変わるため、開いた瞬間の値では足りない。
  const fullSizeRef = useRef(0)
  const restoreTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const draggingRef = useRef<{
    startCoord: number
    lastCoord: number
    lastTime: number
    velocity: number
  } | null>(null)

  const clearRestoreTimer = useCallback(() => {
    if (restoreTimerRef.current) {
      clearTimeout(restoreTimerRef.current)
      restoreTimerRef.current = null
    }
  }, [])

  // 閉→開のたびにオフセットをリセット（前回ドラッグ位置の持ち越しを防ぐ）
  const wasOpenRef = useRef(isOpen)
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      clearRestoreTimer()
      setDragOffset(0)
      setIsDragging(false)
    }

    wasOpenRef.current = isOpen

    return clearRestoreTimer
  }, [isOpen, clearRestoreTimer])

  // ドラッグ終了時のリセット（開き位置へ補間させるため dragOffset を 0 に戻す）
  const endDragging = useCallback(() => {
    draggingRef.current = null
    setIsDragging(false)
    setDragOffset(0)
  }, [])

  // 閉じ確定時は補間を有効にしたまま閉じ位置までスライドさせてからアンマウントさせる。
  // ただし onClose を受けて isOpen を false にするかは利用者次第（確認ダイアログを挟む、
  // そもそも onClickClose を渡さない）なので、猶予を過ぎても開いたままなら開き位置へ戻す。
  // 戻さないと、画面外・フォーカストラップ有効・スクロールロック中のまま操作不能になる。
  const endDraggingForClose = useCallback(() => {
    draggingRef.current = null
    setIsDragging(false)
    setDragOffset(fullSizeRef.current)

    clearRestoreTimer()
    restoreTimerRef.current = setTimeout(() => {
      restoreTimerRef.current = null
      setDragOffset(0)
    }, DRAWER_TRANSITION_DURATION)
  }, [clearRestoreTimer])

  const onPointerDown = useCallback(
    (e: ReactPointerEvent) => {
      clearRestoreTimer()
      fullSizeRef.current = targetRef.current?.getBoundingClientRect().height ?? 0
      draggingRef.current = {
        startCoord: e.clientY,
        lastCoord: e.clientY,
        lastTime: e.timeStamp,
        velocity: 0,
      }
      setIsDragging(true)
      ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    },
    [targetRef, clearRestoreTimer],
  )

  const onPointerMove = useCallback((e: ReactPointerEvent) => {
    const dragging = draggingRef.current

    if (!dragging) return

    const coord = e.clientY
    const dt = e.timeStamp - dragging.lastTime || 1
    // 閉じ方向の速度(px/ms)。閉じる動き = サイズ減少なので velocity を負にする
    dragging.velocity = -(coord - dragging.lastCoord) / dt
    dragging.lastCoord = coord
    dragging.lastTime = e.timeStamp

    setDragOffset(Math.min(fullSizeRef.current, Math.max(0, coord - dragging.startCoord)))
  }, [])

  const onPointerUp = useCallback(
    (e: ReactPointerEvent) => {
      const dragging = draggingRef.current
      const fullSize = fullSizeRef.current
      const result = resolveDragEnd({
        fullSize,
        currentSize: fullSize - dragOffset,
        velocity: dragging
          ? decayVelocity({
              velocity: dragging.velocity,
              idleMs: e.timeStamp - dragging.lastTime,
              decayMs: VELOCITY_DECAY_MS,
            })
          : 0,
        closeThreshold: CLOSE_VELOCITY_THRESHOLD,
      })

      if (result.type === 'close') {
        endDraggingForClose()
        onClose?.()
      } else {
        endDragging()
      }
    },
    [dragOffset, onClose, endDragging, endDraggingForClose],
  )

  // OS 等でポインタ操作が中断されたとき（pointercancel）はドラッグ状態を解除して復帰
  const onPointerCancel = useCallback(() => {
    endDragging()
  }, [endDragging])

  return {
    // inner に適用する translate(px)。閉じ方向にずらす。
    translateOffset: dragOffset,
    isDragging,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
  }
}
