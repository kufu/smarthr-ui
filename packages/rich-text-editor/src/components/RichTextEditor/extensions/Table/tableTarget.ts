import { closeHistory } from '@tiptap/pm/history'
import { TextSelection } from '@tiptap/pm/state'
import { CellSelection, TableMap, addColumn, addRow, selectedRect } from '@tiptap/pm/tables'

import { normalizeHex } from '../../Toolbar/ColorPicker/normalizeHex'

import type { Editor } from '@tiptap/react'

export type TableScope = 'row' | 'column' | 'cell' | 'table'

export const getTableTarget = (editor: Editor, cellPos?: number) => {
  if (cellPos !== undefined && (cellPos < 0 || cellPos + 1 > editor.state.doc.content.size))
    return null
  const $cell =
    cellPos === undefined
      ? editor.state.selection instanceof CellSelection
        ? editor.state.doc.resolve(editor.state.selection.$anchorCell.pos + 1)
        : editor.state.selection.$from
      : editor.state.doc.resolve(cellPos + 1)
  for (let depth = $cell.depth; depth > 0; depth--) {
    if (!['tableCell', 'tableHeader'].includes($cell.node(depth).type.name)) continue
    const pos = $cell.before(depth)
    const tablePos = $cell.before(depth - 2)
    const table = editor.state.doc.nodeAt(tablePos)!
    const map = TableMap.get(table)
    return { pos, tablePos, table, map, rect: map.findCell(pos - tablePos - 1) }
  }
  return null
}

export const selectTableTarget = (editor: Editor, pos: number, scope: TableScope) => {
  const target = getTableTarget(editor, pos)
  if (!target) return false
  const $pos = editor.state.doc.resolve(pos)
  const selection =
    scope === 'table'
      ? TextSelection.near(editor.state.doc.resolve(pos + 1))
      : scope === 'row'
        ? CellSelection.rowSelection($pos)
        : scope === 'column'
          ? CellSelection.colSelection($pos)
          : editor.state.selection instanceof CellSelection &&
              editor.state.selection.$anchorCell.pos === pos
            ? editor.state.selection
            : CellSelection.create(editor.state.doc, pos)
  editor.view.dispatch(editor.state.tr.setSelection(selection))
  return true
}

export const clearTableCells = (editor: Editor) => {
  const selection = editor.state.selection
  if (!(selection instanceof CellSelection)) return
  const cells: Array<{ pos: number; size: number }> = []
  selection.forEachCell((node, pos) => cells.push({ pos, size: node.nodeSize }))
  const tr = editor.state.tr
  cells.reverse().forEach(({ pos, size }) => {
    tr.replaceWith(pos + 1, pos + size - 1, editor.schema.nodes.paragraph.create())
  })
  editor.view.dispatch(tr)
}

export const focusTableCell = (editor: Editor, cellPos?: number) => {
  if (cellPos !== undefined && getTableTarget(editor, cellPos)) {
    editor.view.dispatch(
      editor.state.tr.setSelection(TextSelection.near(editor.state.doc.resolve(cellPos + 1))),
    )
  }
  const selection = editor.state.selection
  if (selection instanceof CellSelection) {
    editor.view.dispatch(
      editor.state.tr.setSelection(
        TextSelection.near(editor.state.doc.resolve(selection.$anchorCell.pos + 1)),
      ),
    )
  }
  editor.commands.focus(undefined, { scrollIntoView: false })
}

/** メニューの操作1回を、前後の入力や他の表操作と同じUndo単位にまとめない。 */
export const runTableAction = (editor: Editor, action: () => unknown) => {
  editor.view.dispatch(closeHistory(editor.state.tr))
  action()
  editor.view.dispatch(closeHistory(editor.state.tr))
}

/** TableMap を基準に挿入する。結合セルと隣接セルの見た目を壊さないため。 */
export const insertTableAxis = (
  editor: Editor,
  axis: 'row' | 'column',
  side: 'before' | 'after' | 'end',
  explicitTablePos?: number,
) => {
  const target = getTableTarget(editor)
  const tablePos = explicitTablePos ?? target?.tablePos
  if (tablePos === undefined) return
  const table = editor.state.doc.nodeAt(tablePos)
  if (!table || table.type.name !== 'table') return
  const map = TableMap.get(table)
  const tableStart = tablePos + 1
  const rect = side === 'end' ? null : selectedRect(editor.state)
  const index =
    axis === 'row'
      ? side === 'end'
        ? map.height
        : side === 'before'
          ? rect!.top
          : rect!.bottom
      : side === 'end'
        ? map.width
        : side === 'before'
          ? rect!.left
          : rect!.right
  const tr = closeHistory(editor.state.tr)
  const oldPositions = new Set(map.map.map((offset) => tableStart + offset))
  const rectangle = {
    map,
    tableStart,
    table,
    top: 0,
    bottom: map.height,
    left: 0,
    right: map.width,
  }
  if (axis === 'row') addRow(tr, rectangle, index)
  else addColumn(tr, rectangle, index)
  const nextTable = tr.doc.nodeAt(tablePos)!
  const nextMap = TableMap.get(nextTable)
  const retainedPositions = new Set([...oldPositions].map((pos) => tr.mapping.map(pos)))
  const visited = new Set<number>()
  const count = axis === 'row' ? nextMap.width : nextMap.height
  for (let i = 0; i < count; i++) {
    const offset =
      nextMap.map[axis === 'row' ? index * nextMap.width + i : i * nextMap.width + index]
    const pos = tableStart + offset
    if (retainedPositions.has(pos) || visited.has(pos)) continue
    visited.add(pos)
    const reference = Math.max(0, index - 1)
    const sourceOffset =
      map.map[axis === 'row' ? reference * map.width + i : i * map.width + reference]
    const source = table.nodeAt(sourceOffset)
    const cell = tr.doc.nodeAt(pos)!
    const sourceColumn = reference - map.findCell(sourceOffset).left
    const sourceElement = editor.view.nodeDOM(tableStart + sourceOffset)
    const columnWidth =
      source?.attrs.colwidth?.[sourceColumn] ??
      (sourceElement instanceof HTMLElement
        ? Math.round(sourceElement.getBoundingClientRect().width / (source?.attrs.colspan ?? 1)) ||
          null
        : null)
    tr.setNodeMarkup(pos, null, {
      ...cell.attrs,
      ...(axis === 'column' && columnWidth ? { colwidth: [columnWidth] } : {}),
      ...(axis === 'row' && source && source.attrs.colspan === cell.attrs.colspan
        ? { colwidth: source.attrs.colwidth }
        : {}),
      color: source?.attrs.color ?? null,
      backgroundColor: source?.attrs.backgroundColor ?? null,
    })
  }
  const firstOffset = nextMap.map[axis === 'row' ? index * nextMap.width : index]
  tr.setSelection(TextSelection.near(tr.doc.resolve(tableStart + firstOffset + 1)))
  editor.view.dispatch(tr)
  editor.view.dispatch(closeHistory(editor.state.tr))
  editor.commands.focus(undefined, { scrollIntoView: false })
}

// 比較用の正規化では不透明度を落とさない。パレットのhex変換で透明度が失われ、別の色が同じと判定されるため。
const normalizeCellColor = (color: string | null): string | null => {
  if (!color) return null
  const alpha = color.match(/^rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\s*\)$/i)?.[1]
  const hex = normalizeHex(color, color)
  return alpha !== undefined && Number(alpha) !== 1 ? `${hex}/${Number(alpha)}` : hex
}

/** 選択範囲に複数の色が混ざる場合は、選択中の色を1つに決められないため null を返す。 */
export const getSelectedCellColor = (editor: Editor, attribute: 'color' | 'backgroundColor') => {
  const colors = new Map<string | null, string | null>()
  const addColor = (color: string | null) => colors.set(normalizeCellColor(color), color)
  const readCell = (cell: NonNullable<ReturnType<typeof editor.state.doc.nodeAt>>) => {
    let hasText = false
    cell.descendants((node) => {
      if (!node.isText) return
      hasText = true
      const inline = node.marks.find((mark) => mark.type.name === 'textStyle')?.attrs[attribute]
      addColor(inline || cell.attrs[attribute] || null)
    })
    if (!hasText) addColor(cell.attrs[attribute] || null)
  }
  if (editor.state.selection instanceof CellSelection) {
    editor.state.selection.forEachCell(readCell)
  } else {
    const target = getTableTarget(editor)
    const cell = target && editor.state.doc.nodeAt(target.pos)
    if (cell) readCell(cell)
  }
  return colors.size === 1 ? [...colors.values()][0] : null
}

export const toggleSelectedCellHeaders = (editor: Editor) => {
  const selection = editor.state.selection
  if (!(selection instanceof CellSelection)) return
  const positions: number[] = []
  let allHeaders = true
  selection.forEachCell((cell, pos) => {
    positions.push(pos)
    if (cell.type.name !== 'tableHeader') allHeaders = false
  })
  const tr = editor.state.tr
  const type = editor.schema.nodes[allHeaders ? 'tableCell' : 'tableHeader']
  positions.forEach((pos) => tr.setNodeMarkup(pos, type, tr.doc.nodeAt(pos)!.attrs))
  editor.view.dispatch(tr)
}
