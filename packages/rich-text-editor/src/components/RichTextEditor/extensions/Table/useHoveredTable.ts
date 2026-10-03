'use client'

import { type RefObject, useEffect, useRef, useState } from 'react'

import { useLatest } from '../../../../hooks/useLatest'
import { type NodeRect, useNodeRect } from '../../hooks/useNodeRect'
import { getControlOrigin, getRelativeRect } from '../floatingGeometry'

import { hitTestExtendedTableArea } from './helpers/extendedHitArea'
import {
  TABLE_BAR_GAP,
  TABLE_BAR_THICKNESS,
  resolveTableDisplayElement,
  resolveTableDisplayElementFromDOM,
} from './tableGeometry'

import type { Editor } from '@tiptap/react'

export type UseHoveredTableReturn = {
  info: NodeRect | null
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

const measureTable = (
  editor: Editor,
  tableEl: HTMLElement,
  origin: { left: number; top: number },
) => {
  const pos = resolveTablePos(editor, tableEl)

  if (pos === null) return null

  return {
    pos,
    rect: getRelativeRect(resolveTableDisplayElement(tableEl).getBoundingClientRect(), origin),
  }
}

export const useHoveredTable = (
  editor: Editor,
  containerRef: RefObject<HTMLElement | null>,
): UseHoveredTableReturn => {
  const [hoveredPos, setHoveredPos] = useState<number | null>(null)
  const [inRightBar, setInRightBar] = useState(false)
  const [inBottomBar, setInBottomBar] = useState(false)
  const rafRef = useRef<number | null>(null)
  const lastEventRef = useRef<MouseEvent | null>(null)
  const latest = useLatest({ containerRef })

  useEffect(() => {
    const container = latest.containerRef.current
    if (!container) return

    const clearAll = () => {
      setHoveredPos(null)
      setInRightBar(false)
      setInBottomBar(false)
    }

    const evaluate = (mouseEvent: MouseEvent) => {
      const origin = getControlOrigin(container)
      const point = { x: mouseEvent.clientX - origin.left, y: mouseEvent.clientY - origin.top }
      const targetEl = mouseEvent.target as HTMLElement | null
      const tableElFromTarget = targetEl?.closest('table') as HTMLElement | null
      // 表の外から直接バー領域に入った場合も、フォーカスなしで操作できる。
      const candidates = tableElFromTarget
        ? [tableElFromTarget]
        : Array.from(editor.view.dom.querySelectorAll<HTMLElement>('table'))

      for (const tableEl of candidates) {
        const measured = measureTable(editor, tableEl, origin)
        if (!measured) continue
        const hit = hitTestExtendedTableArea(point, measured.rect, BAR_THICKNESS)
        if (hit.inside) {
          setHoveredPos(measured.pos)
          setInRightBar(hit.inRightBar)
          setInBottomBar(hit.inBottomBar)
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
  }, [editor, latest])

  const info = useNodeRect(editor, containerRef, hoveredPos, resolveTableDisplayElementFromDOM)

  return { info, inRightBar, inBottomBar }
}
