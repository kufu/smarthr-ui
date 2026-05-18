'use client'

import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'

import type { Editor } from '@tiptap/react'

export type HoveredTableInfo = {
  pos: number
  rect: { top: number; left: number; width: number; height: number }
  containerSize: { width: number; height: number }
  /** ProseMirror（実際の編集領域）のwrapper相対rect。ボタン表示判定の基準にする */
  viewport: { top: number; left: number; width: number; height: number }
}

const CLEAR_DELAY_MS = 150

const resolveTablePos = (editor: Editor, tableEl: HTMLElement): number | null => {
  try {
    const pos = editor.view.posAtDOM(tableEl, 0)
    const $pos = editor.state.doc.resolve(pos)
    for (let d = $pos.depth; d > 0; d--) {
      if ($pos.node(d).type.name === 'table') {
        return $pos.before(d)
      }
    }
  } catch {
    return null
  }
  return null
}

/**
 * .tableWrapper が存在すればその要素（max-width制限・横スクロール考慮）、
 * なければ table 自体を返す。
 */
const resolveDisplayEl = (tableEl: HTMLElement): HTMLElement => {
  const parent = tableEl.parentElement
  if (parent && parent.classList.contains('tableWrapper')) return parent
  return tableEl
}

export type UseHoveredTableReturn = {
  info: HoveredTableInfo | null
  cancelClear: () => void
  scheduleClear: () => void
}

export const useHoveredTable = (
  editor: Editor,
  containerRef: RefObject<HTMLElement | null>,
): UseHoveredTableReturn => {
  const [info, setInfo] = useState<HoveredTableInfo | null>(null)
  const clearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const currentTableElRef = useRef<HTMLElement | null>(null)

  const cancelClear = useCallback(() => {
    if (clearTimeoutRef.current) {
      clearTimeout(clearTimeoutRef.current)
      clearTimeoutRef.current = null
    }
  }, [])

  const scheduleClear = useCallback(() => {
    cancelClear()
    clearTimeoutRef.current = setTimeout(() => {
      currentTableElRef.current = null
      setInfo(null)
      clearTimeoutRef.current = null
    }, CLEAR_DELAY_MS)
  }, [cancelClear])

  const updateRectFromEl = useCallback(
    (tableEl: HTMLElement) => {
      const container = containerRef.current
      if (!container) return
      const pos = resolveTablePos(editor, tableEl)
      if (pos === null) {
        setInfo(null)
        return
      }
      const displayEl = resolveDisplayEl(tableEl)
      const displayRect = displayEl.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      const proseMirrorRect = editor.view.dom.getBoundingClientRect()
      setInfo({
        pos,
        rect: {
          top: displayRect.top - containerRect.top,
          left: displayRect.left - containerRect.left,
          width: displayRect.width,
          height: displayRect.height,
        },
        containerSize: {
          width: containerRect.width,
          height: containerRect.height,
        },
        viewport: {
          top: proseMirrorRect.top - containerRect.top,
          left: proseMirrorRect.left - containerRect.left,
          width: proseMirrorRect.width,
          height: proseMirrorRect.height,
        },
      })
    },
    [editor, containerRef],
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseOver = (e: MouseEvent) => {
      const tableEl = (e.target as HTMLElement).closest('table') as HTMLElement | null
      if (tableEl) {
        // 同じテーブルに戻ってきた場合もタイマーをキャンセル
        // （例: ボタン→隙間→テーブル と移動した時、テーブルに戻ったら維持）
        cancelClear()
        if (tableEl !== currentTableElRef.current) {
          currentTableElRef.current = tableEl
          updateRectFromEl(tableEl)
        }
      }
    }

    const handleMouseOut = (e: MouseEvent) => {
      if (!currentTableElRef.current) return
      const relatedTarget = e.relatedTarget as Node | null
      // tableWrapper も「table の関連エリア」として扱う
      const currentDisplayEl = resolveDisplayEl(currentTableElRef.current)
      if (!relatedTarget || !currentDisplayEl.contains(relatedTarget)) {
        scheduleClear()
      }
    }

    container.addEventListener('mouseover', handleMouseOver)
    container.addEventListener('mouseout', handleMouseOut)

    return () => {
      container.removeEventListener('mouseover', handleMouseOver)
      container.removeEventListener('mouseout', handleMouseOut)
    }
  }, [containerRef, cancelClear, scheduleClear, updateRectFromEl])

  useEffect(() => {
    if (!info) return
    const tableEl = currentTableElRef.current
    const container = containerRef.current
    if (!tableEl || !container) return

    const update = () => {
      if (currentTableElRef.current) updateRectFromEl(currentTableElRef.current)
    }

    const displayEl = resolveDisplayEl(tableEl)
    const resizeObserver = new ResizeObserver(update)
    resizeObserver.observe(displayEl)
    resizeObserver.observe(container)
    // スクロールは位置の変化なので ResizeObserver で検知できない。capture phase で祖先全部のスクロールを拾う。
    window.addEventListener('scroll', update, true)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('scroll', update, true)
    }
    // info全体ではなく posだけを依存にすることで、rect更新による無限ループを防ぐ
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info?.pos, containerRef, updateRectFromEl])

  useEffect(
    () => () => {
      if (clearTimeoutRef.current) clearTimeout(clearTimeoutRef.current)
    },
    [],
  )

  return { info, cancelClear, scheduleClear }
}
