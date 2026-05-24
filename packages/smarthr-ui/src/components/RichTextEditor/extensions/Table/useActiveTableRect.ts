'use client'

import { CellSelection, TableMap } from '@tiptap/pm/tables'
import { type Editor, useEditorState } from '@tiptap/react'
import { type RefObject, useEffect, useRef, useState } from 'react'

import { detectEdgeCells } from './helpers/edgeCellDetection'

export type ActiveTableInfo = {
  pos: number
  rect: { top: number; left: number; width: number; height: number }
  containerSize: { width: number; height: number }
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

/**
 * .tableWrapper が存在すればその rect（max-width制限・横スクロール考慮）、
 * なければ table 自体の rect を使う。
 * これで +行バーの幅などが画面外にはみ出さない。
 */
const resolveDisplayEl = (tableEl: HTMLElement | null): HTMLElement | null => {
  if (!tableEl) return null
  const parent = tableEl.parentElement
  if (parent && parent.classList.contains('tableWrapper')) return parent
  return tableEl
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
  // Use a ref so updateRect can always read the latest edge flags without them being deps
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
      const displayEl = resolveDisplayEl(tableEl)
      const containerEl = containerRef.current
      if (!displayEl || !containerEl) return
      const displayRect = displayEl.getBoundingClientRect()
      const containerRect = containerEl.getBoundingClientRect()
      const proseMirrorRect = editor.view.dom.getBoundingClientRect()
      setInfo({
        pos: tablePos,
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
        isRightmostColumnSelected: edgeFlagsRef.current.isRightmostColumnSelected,
        isBottommostRowSelected: edgeFlagsRef.current.isBottommostRowSelected,
      })
    }

    updateRect()

    const tableEl = resolveTableEl(editor.view.nodeDOM(tablePos) as HTMLElement | null)
    const displayEl = resolveDisplayEl(tableEl)

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
