import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import type { DrawerPosition } from './types'

// ドラッグ終了後の投影距離（速度 × この係数 だけ進むと仮定）
const VELOCITY_PROJECTION_MS = 100

const CLOSE_VELOCITY_THRESHOLD = 0.5 // px/ms

export type DragResolution = { type: 'open' } | { type: 'close' }

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
  position: DrawerPosition
  /** 全開時のサイズ(px) */
  fullSize: number
  /** 開いているかどうか（閉→開で内部状態をリセットする） */
  isOpen: boolean
  onClose?: () => void
}

const isVerticalPosition = (position: DrawerPosition) => position === 'bottom'

export const useDrawerDrag = ({ position, fullSize, isOpen, onClose }: UseDrawerDragArgs) => {
  // 閉じ方向への符号付きドラッグオフセット(px)。閉じ＝正 / 開き＝負
  const [dragOffset, setDragOffset] = useState(0)
  // ドラッグ中はトランジションを切り、指に追従させるために state で持つ
  const [isDragging, setIsDragging] = useState(false)

  // 閉→開のたびにオフセットをリセット（前回ドラッグ位置の持ち越しを防ぐ）
  const wasOpenRef = useRef(isOpen)
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      setDragOffset(0)
      setIsDragging(false)
    }
    wasOpenRef.current = isOpen
  }, [isOpen])

  const draggingRef = useRef<{
    startCoord: number
    lastCoord: number
    lastTime: number
    velocity: number
  } | null>(null)

  // ポインタ座標の移動量を「閉じ方向＝正 / 開き方向＝負」の符号付き値に変換する。
  // （bottom/right は座標増加が閉じ方向、top/left は座標減少が閉じ方向）
  const closingDelta = useCallback(
    (clientCoord: number, startCoord: number) => {
      const raw = clientCoord - startCoord
      const closingPositive = position === 'bottom' || position === 'right'
      return closingPositive ? raw : -raw
    },
    [position],
  )

  // ドラッグ終了時のリセット（開き位置へ補間させるため dragOffset を 0 に戻す）
  const endDragging = useCallback(() => {
    draggingRef.current = null
    setIsDragging(false)
    setDragOffset(0)
  }, [])

  // 閉じ確定時は補間を有効にしたまま閉じ位置までスライドさせてからアンマウントさせる
  const endDraggingForClose = useCallback(() => {
    draggingRef.current = null
    setIsDragging(false)
    setDragOffset(fullSize)
  }, [fullSize])

  const onPointerDown = useCallback(
    (e: ReactPointerEvent) => {
      const coord = isVerticalPosition(position) ? e.clientY : e.clientX
      draggingRef.current = {
        startCoord: coord,
        lastCoord: coord,
        lastTime: e.timeStamp,
        velocity: 0,
      }
      setIsDragging(true)
      ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    },
    [position],
  )

  const onPointerMove = useCallback(
    (e: ReactPointerEvent) => {
      const dragging = draggingRef.current
      if (!dragging) return
      const coord = isVerticalPosition(position) ? e.clientY : e.clientX
      const dt = e.timeStamp - dragging.lastTime || 1
      // 閉じ方向の速度（px/ms）。閉じる動き = サイズ減少なので velocity を負に
      const movementClosing =
        (coord - dragging.lastCoord) * (position === 'bottom' || position === 'right' ? 1 : -1)
      dragging.velocity = -movementClosing / dt
      dragging.lastCoord = coord
      dragging.lastTime = e.timeStamp
      setDragOffset(closingDelta(coord, dragging.startCoord))
    },
    [position, closingDelta],
  )

  const onPointerUp = useCallback(() => {
    const dragging = draggingRef.current
    const currentSize = Math.min(fullSize, Math.max(0, fullSize - dragOffset))
    const result = resolveDragEnd({
      fullSize,
      currentSize,
      velocity: dragging?.velocity ?? 0,
      closeThreshold: CLOSE_VELOCITY_THRESHOLD,
    })

    if (result.type === 'close') {
      endDraggingForClose()
      onClose?.()
    } else {
      endDragging()
    }
  }, [fullSize, dragOffset, onClose, endDragging, endDraggingForClose])

  // OS 等でポインタ操作が中断されたとき（pointercancel）はドラッグ状態を解除して復帰
  const onPointerCancel = useCallback(() => {
    endDragging()
  }, [endDragging])

  // inner に適用する translate(px)。閉じ方向にずらす。
  const translateOffset = useMemo(() => {
    const targetSize = Math.min(fullSize, Math.max(0, fullSize - dragOffset))
    return fullSize - targetSize
  }, [fullSize, dragOffset])

  return {
    translateOffset,
    isDragging,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
  }
}
