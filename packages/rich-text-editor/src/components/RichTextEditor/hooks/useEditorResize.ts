'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { useLatest } from '../../../hooks/useLatest'

import type { PointerEvent as ReactPointerEvent, RefObject } from 'react'

type UseEditorResizeArgs = {
  contentRef: RefObject<HTMLElement | null>
  enabled: boolean
}

export const useEditorResize = ({ contentRef, enabled }: UseEditorResizeArgs) => {
  const [draggedHeight, setDraggedHeight] = useState<number | null>(null)
  // ドラッグ中の起点。state にすると pointermove ごとに購読し直す必要があるため ref に置く
  const dragOriginRef = useRef<{ clientY: number; height: number; minHeight: number } | null>(null)

  const latest = useLatest({ enabled, draggedHeight, contentRef })

  const functions = useMemo(
    () => ({
      handlePointerDown: (e: ReactPointerEvent) => {
        if (!latest.enabled) return

        const proseMirror = latest.contentRef.current?.querySelector<HTMLElement>('.ProseMirror')

        if (!proseMirror) return

        // ドラッグ中に本文のテキストが選択されるのを防ぐ
        e.preventDefault()

        dragOriginRef.current = {
          clientY: e.clientY,
          height: latest.draggedHeight ?? proseMirror.getBoundingClientRect().height,
          // 下限は CSS の min-height を正とする。px を直書きするとトークンと二重管理になるため
          minHeight: parseFloat(getComputedStyle(proseMirror).minHeight) || 0,
        }
      },
    }),
    [latest],
  )

  // setPointerCapture ではなく window で受ける。ハンドルの外にポインタが出ても
  // 追従させる必要があり、かつ jsdom が setPointerCapture を実装していないため。
  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      const origin = dragOriginRef.current

      if (origin) {
        // CSS の min-height でも見た目は止まるが、保持値が下限を下回ると
        // 次のドラッグの起点がずれて「動かしても変わらない」状態になるためここでも止める
        setDraggedHeight(Math.max(origin.minHeight, origin.height + (e.clientY - origin.clientY)))
      }
    }

    const handleUp = () => {
      dragOriginRef.current = null
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
    window.addEventListener('pointercancel', handleUp)

    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      window.removeEventListener('pointercancel', handleUp)
    }
  }, [])

  return { draggedHeight, handlePointerDown: functions.handlePointerDown }
}
