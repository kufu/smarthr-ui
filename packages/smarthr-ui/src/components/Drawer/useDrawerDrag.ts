import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import type { DrawerPosition } from './types'

export type SnapResolution = { type: 'snap'; index: number } | { type: 'close' }

// ドラッグ終了後の投影距離（速度 × この係数 だけ進むと仮定）
const VELOCITY_PROJECTION_MS = 100

type ResolveSnapArgs = {
  /** px 昇順のスナップ位置（大きいほど開いている）。横方向は全開幅 1 要素で渡す */
  snapPoints: number[]
  /** 現在のドラッグ中の開きサイズ(px) */
  currentSize: number
  /** px/ms。正=開く方向、負=閉じる方向 */
  velocity: number
  /** 閉じフリックと判定する速度の大きさ(px/ms) */
  closeThreshold: number
}

export const resolveSnap = ({
  snapPoints,
  currentSize,
  velocity,
  closeThreshold,
}: ResolveSnapArgs): SnapResolution => {
  const lowest = snapPoints[0]

  // 最小スナップ以下かつ閉じ方向の強いフリック → 閉じる
  if (velocity < -closeThreshold && currentSize <= lowest) {
    return { type: 'close' }
  }

  // 速度を加味した投影位置
  const projected = currentSize + velocity * VELOCITY_PROJECTION_MS

  // 最小スナップの半分を下回る → 閉じる
  if (projected < lowest / 2) {
    return { type: 'close' }
  }

  // 投影位置に最も近いスナップを選ぶ
  let nearestIndex = 0
  let nearestDistance = Infinity
  snapPoints.forEach((point, index) => {
    const distance = Math.abs(point - projected)
    if (distance < nearestDistance) {
      nearestDistance = distance
      nearestIndex = index
    }
  })

  return { type: 'snap', index: nearestIndex }
}

const CLOSE_VELOCITY_THRESHOLD = 0.5 // px/ms
const KEYBOARD_STEP_INDEX = 1

type UseDrawerDragArgs = {
  position: DrawerPosition
  /** 正規化済みの px 昇順スナップ配列（縦）。横方向は [extent] 1 要素 */
  snapPoints: number[]
  /** 初期スナップ index */
  initialIndex: number
  /** 開いているかどうか（閉→開で内部状態を初期スナップへリセットする） */
  isOpen: boolean
  onClose?: () => void
}

const isVerticalPosition = (position: DrawerPosition) => position === 'bottom' || position === 'top'

export const useDrawerDrag = ({
  position,
  snapPoints,
  initialIndex,
  isOpen,
  onClose,
}: UseDrawerDragArgs) => {
  const [snapIndex, setSnapIndex] = useState(initialIndex)
  // 閉じ方向への符号付きドラッグオフセット(px)。閉じ＝正 / 開き＝負
  const [dragOffset, setDragOffset] = useState(0)
  // ドラッグ中フラグ。ドラッグ中はトランジションを切り、指に追従させるために state で持つ
  const [isDragging, setIsDragging] = useState(false)

  // 閉→開のたびに初期スナップ位置・オフセットへリセット（前回ドラッグ位置の持ち越しを防ぐ）
  const wasOpenRef = useRef(isOpen)
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      setSnapIndex(initialIndex)
      setDragOffset(0)
      setIsDragging(false)
    }
    wasOpenRef.current = isOpen
  }, [isOpen, initialIndex])

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

  // スナップ確定時のリセット（スナップ位置へ補間させるため dragOffset を 0 に戻す）
  const endDragging = useCallback(() => {
    draggingRef.current = null
    setIsDragging(false)
    setDragOffset(0)
  }, [])

  // 閉じ確定時のリセット。dragOffset を 0 に戻すと一瞬スナップ位置へ戻ってから消えて見えるため、
  // 補間を有効にしたまま閉じ位置（最小サイズ=0）までスライドさせてからアンマウントさせる。
  const endDraggingForClose = useCallback(() => {
    draggingRef.current = null
    setIsDragging(false)
    // targetSize を 0 にする = 完全に閉じ位置へ。下方向へ滑り切ってから消える。
    setDragOffset(snapPoints[snapIndex])
  }, [snapPoints, snapIndex])

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
    const fullSize = snapPoints[snapPoints.length - 1]
    // dragOffset は符号付き（閉じ＝正 / 開き＝負）。開きで最大、閉じで 0 にクランプ。
    const currentSize = Math.min(fullSize, Math.max(0, snapPoints[snapIndex] - dragOffset))
    const result = resolveSnap({
      snapPoints,
      currentSize,
      velocity: dragging?.velocity ?? 0,
      closeThreshold: CLOSE_VELOCITY_THRESHOLD,
    })
    if (result.type === 'close') {
      endDraggingForClose()
      onClose?.()
    } else {
      endDragging()
      setSnapIndex(result.index)
    }
  }, [snapPoints, snapIndex, dragOffset, onClose, endDragging, endDraggingForClose])

  // OS 等でポインタ操作が中断されたとき（pointercancel）はドラッグ状態を解除して復帰
  const onPointerCancel = useCallback(() => {
    endDragging()
  }, [endDragging])

  // 矢印キーでスナップ段階を移動（縦方向のみ利用）
  const onHandleKeyDown = useCallback(
    (e: { key: string; preventDefault: () => void }) => {
      const max = snapPoints.length - 1
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
        setSnapIndex((prev) => Math.min(max, prev + KEYBOARD_STEP_INDEX))
        e.preventDefault()
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
        setSnapIndex((prev) => Math.max(0, prev - KEYBOARD_STEP_INDEX))
        e.preventDefault()
      }
    },
    [snapPoints.length],
  )

  // inner に適用する translate(px)。閉じ方向にずらす。
  // dragOffset は符号付き（閉じ＝正 / 開き＝負）。targetSize を [0, fullSize] にクランプし、
  // 最大スナップを超えて開く・閉じ位置を超えて飛び出す、のどちらも防ぐ。
  const translateOffset = useMemo(() => {
    const fullSize = snapPoints[snapPoints.length - 1]
    const targetSize = Math.min(fullSize, Math.max(0, snapPoints[snapIndex] - dragOffset))
    return fullSize - targetSize // この分だけ閉じ方向に退避
  }, [snapPoints, snapIndex, dragOffset])

  return {
    snapIndex,
    translateOffset,
    isDragging,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onHandleKeyDown,
  }
}
