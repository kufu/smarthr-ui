import { Editor } from '@tiptap/core'
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table'
import { CellSelection } from '@tiptap/pm/tables'
import StarterKit from '@tiptap/starter-kit'
import { afterEach, describe, expect, it } from 'vitest'

import { CellAppearance } from './CellAppearance'
import {
  clearTableCells,
  focusTableCell,
  getSelectedCellColor,
  getTableTarget,
  insertTableAxis,
  runTableAction,
  selectTableTarget,
} from './tableTarget'

let editor: Editor
const createEditor = () => {
  editor = new Editor({
    extensions: [StarterKit, Table, TableRow, TableCell, TableHeader, CellAppearance],
  })
  editor.commands.insertTable({ rows: 3, cols: 3, withHeaderRow: false })
  return editor
}
afterEach(() => editor?.destroy())

describe('table context actions', () => {
  it('targets the clicked column instead of the caret and undoes a color change atomically', () => {
    createEditor()
    const target = getTableTarget(editor)!
    const pos = target.tablePos + 1 + target.map.map[1]
    selectTableTarget(editor, pos, 'column')
    runTableAction(editor, () => editor.commands.setCellAttribute('backgroundColor', '#fde2ea'))
    const table = getTableTarget(editor)!.table
    table.forEach((row) =>
      row.forEach((cell, _offset, index) =>
        expect(cell.attrs.backgroundColor).toBe(index === 1 ? '#fde2ea' : null),
      ),
    )
    editor.commands.undo()
    getTableTarget(editor)!.table.forEach((row) =>
      row.forEach((cell) => expect(cell.attrs.backgroundColor).toBeNull()),
    )
  })
  it('clears contents while preserving cell attributes and supports undo', () => {
    createEditor()
    editor.commands.insertContent('Keep formatting')
    editor.commands.setCellAttribute('color', '#0077c7')
    const pos = getTableTarget(editor)!.pos
    selectTableTarget(editor, pos, 'cell')
    runTableAction(editor, () => clearTableCells(editor))
    expect(editor.state.doc.nodeAt(pos)?.textContent).toBe('')
    expect(editor.state.doc.nodeAt(pos)?.attrs.color).toBe('#0077c7')
    editor.commands.undo()
    expect(editor.state.doc.nodeAt(pos)?.textContent).toBe('Keep formatting')
  })
  it('keeps rectangular selections for merging and resolves merged row targets', () => {
    createEditor()
    const target = getTableTarget(editor)!
    const start = target.tablePos + 1
    editor.commands.setCellSelection({
      anchorCell: start + target.map.map[0],
      headCell: start + target.map.map[1],
    })
    selectTableTarget(editor, start + target.map.map[0], 'cell')
    expect(editor.state.selection).toBeInstanceOf(CellSelection)
    expect(editor.commands.mergeCells()).toBe(true)
    selectTableTarget(editor, start + target.map.map[0], 'row')
    expect((editor.state.selection as CellSelection).isRowSelection()).toBe(true)
    focusTableCell(editor)
    expect(editor.state.selection).not.toBeInstanceOf(CellSelection)
  })
  it('persists the adjacent column width when adding a column and restores it with undo', () => {
    createEditor()
    const target = getTableTarget(editor)!
    selectTableTarget(editor, target.tablePos + 1 + target.map.map[2], 'column')
    editor.commands.setCellAttribute('colwidth', [180])
    insertTableAxis(editor, 'column', 'end', target.tablePos)
    getTableTarget(editor)!.table.forEach((row) =>
      expect(row.lastChild!.attrs.colwidth).toEqual([180]),
    )
    expect(editor.getHTML()).toContain('width: 180px')
    editor.commands.undo()
    expect(getTableTarget(editor)!.map.width).toBe(3)
  })

  it('inherits adjacent colors on insertion without duplicating a header row', () => {
    createEditor()
    editor.commands.toggleHeaderRow()
    editor.commands.setCellAttribute('backgroundColor', '#fde2ea')
    const tablePos = getTableTarget(editor)!.tablePos
    selectTableTarget(editor, getTableTarget(editor)!.pos, 'row')
    insertTableAxis(editor, 'row', 'after')
    const table = editor.state.doc.nodeAt(tablePos)!
    expect(table.childCount).toBe(4)
    expect(table.child(1).firstChild?.attrs.backgroundColor).toBe('#fde2ea')
    expect(table.child(1).firstChild?.type.name).toBe('tableCell')
    editor.commands.undo()
    expect(editor.state.doc.nodeAt(tablePos)?.childCount).toBe(3)
  })
  it('appends to an explicit table and keeps the final column appearance', () => {
    createEditor()
    const target = getTableTarget(editor)!
    const last = target.tablePos + 1 + target.map.map[2]
    selectTableTarget(editor, last, 'column')
    editor.commands.setCellAttribute('color', '#0077c7')
    insertTableAxis(editor, 'column', 'end', target.tablePos)
    const table = editor.state.doc.nodeAt(target.tablePos)!
    table.forEach((row) => expect(row.lastChild?.attrs.color).toBe('#0077c7'))
    expect(table.firstChild?.childCount).toBe(4)
  })
  it('clears a whole row in one undo step and preserves its formatting', () => {
    createEditor()
    const target = getTableTarget(editor)!
    const pos = target.tablePos + 1 + target.map.map[0]
    editor.commands.insertContent('first')
    editor.commands.goToNextCell()
    editor.commands.insertContent('second')
    selectTableTarget(editor, pos, 'row')
    runTableAction(editor, () => editor.commands.setCellAttribute('backgroundColor', '#fde2ea'))
    runTableAction(editor, () => clearTableCells(editor))
    expect(editor.state.doc.nodeAt(target.tablePos)!.firstChild!.textContent).toBe('')
    editor.commands.undo()
    expect(editor.state.doc.nodeAt(target.tablePos)!.firstChild!.textContent).toBe('firstsecond')
    expect(editor.state.doc.nodeAt(pos)!.attrs.backgroundColor).toBe('#fde2ea')
  })
  it('does not claim a single color for a mixed selection', () => {
    createEditor()
    const pos = getTableTarget(editor)!.pos
    editor.commands.setCellAttribute('color', '#0077c7')
    selectTableTarget(editor, pos, 'row')
    expect(getSelectedCellColor(editor, 'color')).toBeNull()
    editor.commands.setCellAttribute('color', '#0077c7')
    expect(getSelectedCellColor(editor, 'color')).toBe('#0077c7')
  })
  it('round trips cell colors through HTML and rejects unsafe CSS', () => {
    createEditor()
    editor.commands.setCellAttribute('color', '#0077c7')
    runTableAction(editor, () => editor.commands.setCellAttribute('backgroundColor', '#fde2ea'))
    const html = editor.getHTML()
    editor.commands.setContent(html)
    expect(editor.getHTML()).toContain('background-color:')
    const cells: unknown[] = []
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'tableCell') cells.push(node.attrs.color)
    })
    expect(cells.some(Boolean)).toBe(true)
    editor.commands.setTextSelection(4)
    editor.commands.setCellAttribute('color', 'red;position:fixed')
    expect(editor.getHTML()).not.toContain('position:fixed')
  })
})
