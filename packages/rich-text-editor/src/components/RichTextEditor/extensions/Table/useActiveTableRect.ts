'use client'

import { CellSelection, TableMap } from '@tiptap/pm/tables'
import { type Editor, useEditorState } from '@tiptap/react'
import { type RefObject, useMemo } from 'react'

import { type NodeRect, useNodeRect } from '../../hooks/useNodeRect'

import { detectEdgeCells } from './helpers/edgeCellDetection'
import { resolveTableDisplayElementFromDOM } from './tableGeometry'

export type ActiveTableInfo = NodeRect & {
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
  const nodeRect = useNodeRect(editor, containerRef, tablePos, resolveTableDisplayElementFromDOM)

  return useMemo(
    () => (nodeRect ? { ...nodeRect, isRightmostColumnSelected, isBottommostRowSelected } : null),
    [nodeRect, isRightmostColumnSelected, isBottommostRowSelected],
  )
}
