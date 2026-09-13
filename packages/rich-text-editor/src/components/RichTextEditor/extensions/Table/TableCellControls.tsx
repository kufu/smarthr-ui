'use client'

import { CellSelection } from '@tiptap/pm/tables'
import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'

import { TableContextMenu } from './TableContextMenu'
import { getTableControlOrigin } from './tableGeometry'
import { type TableScope, getTableTarget } from './tableTarget'

import type { RichTextFeature } from '../../types'
import type { Editor } from '@tiptap/react'

/**
 * 表ハンドルは tableTop の上に置くため、tableTop のクランプはこの分だけ
 * 編集領域の上端から余裕を取る。26 のままだと表を上へスクロールしたときに
 * ハンドルの上端が編集領域の外へ出て、ツールバーの下に潜る。
 */
const TABLE_HANDLE_OFFSET = 28

type Props = {
  features: readonly RichTextFeature[]
  editor: Editor
  containerRef: RefObject<HTMLElement | null>
}
type Geometry = {
  cellPos: number
  pos: number
  left: number
  top: number
  width: number
  height: number
  tableLeft: number
  tableTop: number
  highlight: { top: number; left: number; width: number; height: number }
}

export const TableCellControls = ({ editor, containerRef, features }: Props) => {
  const lockedTarget = useRef<{ scope: TableScope; pos: number } | null>(null)
  const openTableMenu = useRef<((pos?: number) => void) | null>(null)
  const openColumnMenu = useRef<((pos?: number) => void) | null>(null)
  const openRowMenu = useRef<((pos?: number) => void) | null>(null)
  const openCellMenu = useRef<((pos?: number) => void) | null>(null)
  const updateGeometry = useRef<(() => void) | null>(null)
  const onTargetLock = useCallback((scope: TableScope, pos: number | null) => {
    if (pos !== null) lockedTarget.current = { scope, pos }
    else if (lockedTarget.current?.scope === scope) lockedTarget.current = null
    updateGeometry.current?.()
  }, [])
  const [geometry, setGeometry] = useState<Geometry | null>(null)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let hovered: number | undefined
    const update = () => {
      const target =
        getTableTarget(editor, lockedTarget.current?.pos ?? hovered) ?? getTableTarget(editor)
      if (!target) {
        setGeometry(null)
        return
      }
      const cell = editor.view.nodeDOM(target.pos)
      if (!(cell instanceof HTMLElement)) return
      const table = cell.closest('table')
      if (!table) return
      const wrapper = table.parentElement!
      let rect = cell.getBoundingClientRect()
      const clip = wrapper.getBoundingClientRect()
      const viewport = editor.view.dom.getBoundingClientRect()
      // 絶対配置の原点はコンテナのボーダー内側。
      const selectedTarget = getTableTarget(editor)
      const cellTarget = selectedTarget?.tablePos === target.tablePos ? selectedTarget : target
      const selectedElement = editor.view.nodeDOM(cellTarget.pos)
      let highlightRect =
        selectedElement instanceof HTMLElement ? selectedElement.getBoundingClientRect() : rect
      if (editor.state.selection instanceof CellSelection) {
        const rects: DOMRect[] = []
        editor.state.selection.forEachCell((_node, pos) => {
          const element = editor.view.nodeDOM(pos)
          if (element instanceof HTMLElement && table.contains(element))
            rects.push(element.getBoundingClientRect())
        })
        // 起点セルが画面外でも、選択範囲内の見えているセルに操作UIを置く。
        if (
          rect.right <= clip.left ||
          rect.left >= clip.right ||
          rect.bottom <= viewport.top ||
          rect.top >= viewport.bottom
        ) {
          const visible = rects.find(
            (r) =>
              r.right > clip.left &&
              r.left < clip.right &&
              r.bottom > viewport.top &&
              r.top < viewport.bottom,
          )
          if (visible) rect = visible
        }
        if (rects.length) {
          const x = Math.min(...rects.map((r) => r.left))
          const y = Math.min(...rects.map((r) => r.top))
          highlightRect = new DOMRect(
            x,
            y,
            Math.max(...rects.map((r) => r.right)) - x,
            Math.max(...rects.map((r) => r.bottom)) - y,
          )
        }
      }
      const top = Math.max(rect.top, viewport.top)
      const bottom = Math.min(rect.bottom, viewport.bottom)
      const left = Math.max(rect.left, clip.left)
      const right = Math.min(rect.right, clip.right)
      if (right <= left || bottom <= top) {
        setGeometry(null)
        return
      }
      const highlightLeft = Math.max(highlightRect.left, clip.left)
      const highlightTop = Math.max(highlightRect.top, viewport.top)
      const { left: originLeft, top: originTop } = getTableControlOrigin(container)
      const tableRect = table.getBoundingClientRect()
      setGeometry({
        cellPos: cellTarget.pos,
        highlight: {
          left: highlightLeft - originLeft,
          top: highlightTop - originTop,
          width: Math.max(0, Math.min(highlightRect.right, clip.right) - highlightLeft),
          height: Math.max(0, Math.min(highlightRect.bottom, viewport.bottom) - highlightTop),
        },
        pos: target.pos,
        left: left - originLeft,
        top: top - originTop,
        width: right - left,
        height: bottom - top,
        tableLeft: clip.left - originLeft,
        tableTop: Math.max(tableRect.top, viewport.top + TABLE_HANDLE_OFFSET) - originTop,
      })
    }
    updateGeometry.current = update
    const move = (event: MouseEvent) => {
      if (lockedTarget.current || editor.state.selection instanceof CellSelection) return
      const cell = event.target instanceof Element ? event.target.closest('td, th') : null
      if (!cell || !editor.view.dom.contains(cell)) return
      hovered = editor.view.posAtDOM(cell, 0) - 1
      update()
    }
    const selected = () => {
      hovered = undefined
      update()
    }
    const leave = () => {
      if (!container.querySelector('[aria-expanded="true"]')) selected()
    }
    let openFrame: number | null = null
    const openActions = (scope: TableScope = 'cell') => {
      const target = getTableTarget(editor)
      if (!target) return
      hovered = undefined
      const cell = editor.view.nodeDOM(target.pos)
      if (cell instanceof HTMLElement) cell.scrollIntoView({ block: 'nearest', inline: 'nearest' })
      update()
      if (openFrame !== null) cancelAnimationFrame(openFrame)
      openFrame = requestAnimationFrame(() => {
        openFrame = requestAnimationFrame(() => {
          openFrame = null
          const menus = {
            cell: openCellMenu,
            table: openTableMenu,
            column: openColumnMenu,
            row: openRowMenu,
          }
          menus[scope].current?.(target.pos)
        })
      })
    }
    if (editor.storage.table) editor.storage.table.openActionsMenu = openActions
    editor.on('selectionUpdate', selected)
    editor.on('update', selected)
    container.addEventListener('mousemove', move)
    container.addEventListener('mouseleave', leave)
    window.addEventListener('scroll', update, true)
    const observer = new ResizeObserver(update)
    observer.observe(container)
    observer.observe(editor.view.dom)
    update()
    return () => {
      if (editor.storage.table?.openActionsMenu === openActions)
        editor.storage.table.openActionsMenu = null
      if (openFrame !== null) cancelAnimationFrame(openFrame)
      updateGeometry.current = null
      editor.off('selectionUpdate', selected)
      editor.off('update', selected)
      container.removeEventListener('mousemove', move)
      container.removeEventListener('mouseleave', leave)
      window.removeEventListener('scroll', update, true)
      observer.disconnect()
    }
  }, [editor, containerRef])
  if (!geometry) return null
  const { pos, cellPos, left, top, width, height, tableLeft, tableTop, highlight } = geometry
  return (
    <>
      <span
        className="shr-pointer-events-none shr-absolute shr-rounded-s shr-text-main"
        style={{
          ...highlight,
          outline: '2px solid currentColor',
          outlineOffset: -2,
        }}
        aria-hidden="true"
      />
      <TableContextMenu
        openMenuRef={openTableMenu}
        features={features}
        editor={editor}
        cellPos={pos}
        scope="table"
        style={{
          top: tableTop - TABLE_HANDLE_OFFSET,
          left: Math.max(0, tableLeft - 28),
          width: 22,
          height: 22,
        }}
        onTargetLock={onTargetLock}
      />
      <TableContextMenu
        openMenuRef={openColumnMenu}
        features={features}
        editor={editor}
        cellPos={pos}
        scope="column"
        style={{ top: tableTop - 26, left, width, height: 18 }}
        onTargetLock={onTargetLock}
      />
      <TableContextMenu
        openMenuRef={openRowMenu}
        features={features}
        editor={editor}
        cellPos={pos}
        scope="row"
        style={{ top, left: Math.max(0, tableLeft - 26), width: 18, height }}
        onTargetLock={onTargetLock}
      />
      <TableContextMenu
        openMenuRef={openCellMenu}
        features={features}
        editor={editor}
        cellPos={cellPos}
        scope="cell"
        style={{
          top: highlight.top + Math.max(0, (highlight.height - 28) / 2),
          // 内側に描く2pxの選択枠の中心に合わせる。
          left: highlight.left + highlight.width - 13,
          width: 24,
          height: 28,
        }}
        onTargetLock={onTargetLock}
      />
    </>
  )
}
