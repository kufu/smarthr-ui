'use client'

import { type RefObject, useEffect, useRef, useState } from 'react'

import { hitTestExtendedTableArea } from './helpers/extendedHitArea'
import {
  TABLE_BAR_GAP,
  TABLE_BAR_THICKNESS,
  getRelativeRect,
  getTableControlOrigin,
  resolveTableDisplayElement,
} from './tableGeometry'

import type { Editor } from '@tiptap/react'

export type HoveredTableInfo = {
  pos: number
  rect: { top: number; left: number; width: number; height: number }
  /** ProseMirror（実際の編集領域）のwrapper相対rect。ボタン表示判定の基準にする */
  viewport: { top: number; left: number; width: number; height: number }
}

export type UseHoveredTableReturn = {
  info: HoveredTableInfo | null
  inRightBar: boolean
  inBottomBar: boolean
}

const BAR_THICKNESS = TABLE_BAR_GAP + TABLE_BAR_THICKNESS

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

const buildHoveredInfo = (
  editor: Editor,
  tableEl: HTMLElement,
  container: HTMLElement,
): HoveredTableInfo | null => {
  const pos = resolveTablePos(editor, tableEl)
  if (pos === null) return null
  const displayRect = resolveTableDisplayElement(tableEl).getBoundingClientRect()
  const containerRect = getTableControlOrigin(container)
  const proseMirrorRect = editor.view.dom.getBoundingClientRect()
  return {
    pos,
    rect: getRelativeRect(displayRect, containerRect),
    viewport: getRelativeRect(proseMirrorRect, containerRect),
  }
}

export const useHoveredTable = (
  editor: Editor,
  containerRef: RefObject<HTMLElement | null>,
): UseHoveredTableReturn => {
  const [info, setInfo] = useState<HoveredTableInfo | null>(null)
  const [inRightBar, setInRightBar] = useState(false)
  const [inBottomBar, setInBottomBar] = useState(false)
  const rafRef = useRef<number | null>(null)
  const lastEventRef = useRef<MouseEvent | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const clearAll = () => {
      setInfo(null)
      setInRightBar(false)
      setInBottomBar(false)
    }

    const applyHit = (
      next: HoveredTableInfo | null,
      hit: { inside: boolean; inRightBar: boolean; inBottomBar: boolean },
    ) => {
      if (!hit.inside || !next) {
        clearAll()
        return
      }
      setInfo(next)
      setInRightBar(hit.inRightBar)
      setInBottomBar(hit.inBottomBar)
    }

    const evaluate = (mouseEvent: MouseEvent) => {
      const containerRect = getTableControlOrigin(container)
      const cx = mouseEvent.clientX - containerRect.left
      const cy = mouseEvent.clientY - containerRect.top
      const targetEl = mouseEvent.target as HTMLElement | null
      const tableElFromTarget = targetEl?.closest('table') as HTMLElement | null

      if (tableElFromTarget) {
        const next = buildHoveredInfo(editor, tableElFromTarget, container)
        if (!next) {
          clearAll()
          return
        }
        const hit = hitTestExtendedTableArea({ x: cx, y: cy }, next.rect, BAR_THICKNESS)
        applyHit(next, hit)
        return
      }

      // 表の外から直接バー領域に入った場合も、フォーカスなしで操作できる。
      for (const tableEl of Array.from(editor.view.dom.querySelectorAll<HTMLElement>('table'))) {
        const next = buildHoveredInfo(editor, tableEl, container)
        if (!next) continue
        const hit = hitTestExtendedTableArea({ x: cx, y: cy }, next.rect, BAR_THICKNESS)
        if (hit.inside) {
          applyHit(next, hit)
          return
        }
      }
      clearAll()
    }

    const handleMouseMove = (e: MouseEvent) => {
      lastEventRef.current = e
      if (rafRef.current === null) {
        rafRef.current = window.requestAnimationFrame(() => {
          rafRef.current = null
          const last = lastEventRef.current
          if (last) evaluate(last)
        })
      }
    }

    const handleMouseLeave = () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      clearAll()
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current)
    }
  }, [editor, containerRef])

  // テーブルの位置変動（スクロール、リサイズ）に追従して info.rect を更新
  useEffect(() => {
    if (!info) return
    const container = containerRef.current
    if (!container) return
    const update = () => {
      const tableNode = editor.view.nodeDOM(info.pos)
      const tableEl =
        tableNode instanceof HTMLElement
          ? tableNode.tagName === 'TABLE'
            ? tableNode
            : tableNode.querySelector<HTMLElement>('table')
          : null
      if (!tableEl) {
        setInfo(null)
        return
      }
      const next = buildHoveredInfo(editor, tableEl, container)
      if (next && next.pos === info.pos) setInfo(next)
    }
    let updateFrame: number | null = null
    const onUpdate = () => {
      if (updateFrame !== null) cancelAnimationFrame(updateFrame)
      updateFrame = requestAnimationFrame(() => {
        updateFrame = null
        update()
      })
    }
    const resizeObserver = new ResizeObserver(update)
    resizeObserver.observe(container)
    const node = editor.view.nodeDOM(info.pos)
    if (node instanceof HTMLElement) {
      resizeObserver.observe(node)
      const table = node.matches('table') ? node : node.querySelector('table')
      if (table) resizeObserver.observe(table)
    }
    editor.on('update', onUpdate)
    window.addEventListener('scroll', update, true)
    return () => {
      resizeObserver.disconnect()
      editor.off('update', onUpdate)
      if (updateFrame !== null) cancelAnimationFrame(updateFrame)
      window.removeEventListener('scroll', update, true)
    }
  }, [info?.pos, editor, containerRef]) // eslint-disable-line react-hooks/exhaustive-deps

  return { info, inRightBar, inBottomBar }
}
