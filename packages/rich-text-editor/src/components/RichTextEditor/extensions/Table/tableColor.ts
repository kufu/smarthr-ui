import { CellSelection } from '@tiptap/pm/tables'

import { getSelectedCellColor, getTableTarget, runTableAction } from './tableTarget'

import type { Editor } from '@tiptap/react'

type ColorAttribute = 'color' | 'backgroundColor'

export const getEditorColor = (editor: Editor, attribute: ColorAttribute): string | null => {
  if (editor.state.selection instanceof CellSelection)
    return getSelectedCellColor(editor, attribute)
  const inlineColor = editor.getAttributes('textStyle')[attribute]
  const target = getTableTarget(editor)
  const cellColor = target && editor.state.doc.nodeAt(target.pos)?.attrs[attribute]
  return inlineColor || cellColor || null
}

/** セルの色を設定する。同じ属性のインラインの上書きが残ると色が揃わないため、併せて取り除く。 */
export const setTableCellColor = (
  editor: Editor,
  attribute: ColorAttribute,
  value: string | null,
) => {
  const positions: number[] = []
  if (editor.state.selection instanceof CellSelection) {
    editor.state.selection.forEachCell((_cell, pos) => positions.push(pos))
  } else {
    const target = getTableTarget(editor)
    if (target) positions.push(target.pos)
  }
  const tr = editor.state.tr
  for (const pos of positions) {
    const cell = tr.doc.nodeAt(pos)!
    tr.setNodeMarkup(pos, null, { ...cell.attrs, [attribute]: value })
    cell.descendants((node, offset) => {
      if (!node.isText) return
      const mark = node.marks.find((candidate) => candidate.type.name === 'textStyle')
      if (!mark?.attrs[attribute]) return
      const from = pos + 1 + offset
      const to = from + node.nodeSize
      const attrs = { ...mark.attrs, [attribute]: null }
      tr.removeMark(from, to, mark.type)
      if (Object.values(attrs).some(Boolean)) tr.addMark(from, to, mark.type.create(attrs))
    })
  }
  const stored = tr.storedMarks
  if (stored)
    tr.setStoredMarks(
      stored.flatMap((mark) => {
        if (mark.type.name !== 'textStyle') return [mark]
        const attrs = { ...mark.attrs, [attribute]: null }
        return Object.values(attrs).some(Boolean) ? [mark.type.create(attrs)] : []
      }),
    )
  editor.view.dispatch(tr)
}

export const setEditorColor = (editor: Editor, attribute: ColorAttribute, value: string | null) => {
  if (
    editor.state.selection instanceof CellSelection ||
    (editor.state.selection.empty && getTableTarget(editor))
  ) {
    runTableAction(editor, () => setTableCellColor(editor, attribute, value))
    editor.commands.focus(undefined, { scrollIntoView: false })
    return
  }
  const chain = editor.chain().focus()
  if (attribute === 'color') {
    if (value) chain.setColor(value).run()
    else chain.unsetColor().run()
  } else if (value) chain.setBackgroundColor(value).run()
  else chain.unsetBackgroundColor().run()
}
