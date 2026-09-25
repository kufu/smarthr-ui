'use client'

import { CellSelection, TableMap } from '@tiptap/pm/tables'
import { type Editor, useEditorState } from '@tiptap/react'
import { type RefObject, useEffect, useRef, useState } from 'react'

import { detectEdgeCells } from './helpers/edgeCellDetection'
import { getRelativeRect, getTableControlOrigin, resolveTableDisplayElement } from './tableGeometry'

export type ActiveTableInfo = {
  pos: number
  rect: { top: number; left: number; width: number; height: number }
  /** ProseMirror（実際の編集領域）のwrapper相対rect。ボタン表示判定の基準にする */
  viewport: { top: number; left: number; width: number; height: number }
  /** caret/選択が最右列のいずれかのセルに触れている */
  isRightmostColumnSelected: boolean
  /** caret/選択が最下行のいずれかのセルに触れている */
  isBottommostRowSelected: boolean
}

const findTablePos = (editor: Editor): number | null => {
  const { $from } = editor.state.selection
  for (let depth = $from.depth; depth > 0; depth--) {
    if ($from.node(depth).type.name === 'table') {
      return $from.before(depth)
    }
  }
  return null
}

const resolveTableEl = (rootEl: HTMLElement | null): HTMLElement | null => {
  if (!rootEl) return null
  if (rootEl.tagName === 'TABLE') return rootEl
  return rootEl.querySelector('table')
}

const computeEdgeCells = (
  editor: Editor,
  tablePos: number,
): { isRightmostColumnSelected: boolean; isBottommostRowSelected: boolean } => {
  const tableNode = editor.state.doc.nodeAt(tablePos)
  if (!tableNode || tableNode.type.name !== 'table') {
    return { isRightmostColumnSelected: false, isBottommostRowSelected: false }
  }
  const map = TableMap.get(tableNode)
  const tableStart = tablePos + 1
  const selection = editor.state.selection

  let cellOffsets: number[] = []
  if (selection instanceof CellSelection) {
    selection.forEachCell((_cellNode, cellPos) => {
      cellOffsets.push(cellPos - tableStart)
    })
  } else {
    const { $from } = selection
    for (let d = $from.depth; d > 0; d--) {
      const typeName = $from.node(d).type.name
      if (typeName === 'tableCell' || typeName === 'tableHeader') {
        cellOffsets = [$from.before(d) - tableStart]
        break
      }
    }
  }
  return detectEdgeCells(map, cellOffsets)
}

export const useActiveTableRect = (
  editor: Editor,
  containerRef: RefObject<HTMLElement | null>,
): ActiveTableInfo | null => {
  const activeSelection = useEditorState({
    editor,
    selector: ({ editor: e }) => {
      if (!e.isActive('table')) return null
      const tablePos = findTablePos(e)
      if (tablePos === null) return null
      const edge = computeEdgeCells(e, tablePos)
      return { tablePos, edge }
    },
    equalityFn: (a, b) =>
      a === b ||
      (!!a &&
        !!b &&
        a.tablePos === b.tablePos &&
        a.edge.isRightmostColumnSelected === b.edge.isRightmostColumnSelected &&
        a.edge.isBottommostRowSelected === b.edge.isBottommostRowSelected),
  })
  const tablePos = activeSelection?.tablePos ?? null
  const isRightmostColumnSelected = activeSelection?.edge.isRightmostColumnSelected ?? false
  const isBottommostRowSelected = activeSelection?.edge.isBottommostRowSelected ?? false
  // updateRect の依存に入れずに最新の端フラグを読むため ref に持つ。依存に入れると選択のたびに購読し直しになる。
  const edgeFlagsRef = useRef({ isRightmostColumnSelected, isBottommostRowSelected })
  edgeFlagsRef.current = { isRightmostColumnSelected, isBottommostRowSelected }

  const [info, setInfo] = useState<ActiveTableInfo | null>(null)

  useEffect(() => {
    if (tablePos === null) {
      setInfo(null)
      return
    }

    const updateRect = () => {
      const tableEl = resolveTableEl(editor.view.nodeDOM(tablePos) as HTMLElement | null)
      const displayEl = tableEl ? resolveTableDisplayElement(tableEl) : null
      const containerEl = containerRef.current
      if (!displayEl || !containerEl) return
      const displayRect = displayEl.getBoundingClientRect()
      const containerRect = getTableControlOrigin(containerEl)
      const proseMirrorRect = editor.view.dom.getBoundingClientRect()
      setInfo({
        pos: tablePos,
        rect: getRelativeRect(displayRect, containerRect),
        viewport: getRelativeRect(proseMirrorRect, containerRect),
        isRightmostColumnSelected: edgeFlagsRef.current.isRightmostColumnSelected,
        isBottommostRowSelected: edgeFlagsRef.current.isBottommostRowSelected,
      })
    }

    updateRect()

    const tableEl = resolveTableEl(editor.view.nodeDOM(tablePos) as HTMLElement | null)
    const displayEl = tableEl ? resolveTableDisplayElement(tableEl) : null

    const resizeObserver = new ResizeObserver(updateRect)
    if (displayEl) resizeObserver.observe(displayEl)
    if (containerRef.current) resizeObserver.observe(containerRef.current)
    // スクロールは位置の変化なので ResizeObserver で検知できない。capture phase で祖先全部のスクロールを拾う。
    window.addEventListener('scroll', updateRect, true)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('scroll', updateRect, true)
    }
  }, [editor, tablePos, containerRef])

  useEffect(() => {
    setInfo((prev) =>
      prev
        ? {
            ...prev,
            isRightmostColumnSelected,
            isBottommostRowSelected,
          }
        : prev,
    )
  }, [isRightmostColumnSelected, isBottommostRowSelected])

  return info
}
