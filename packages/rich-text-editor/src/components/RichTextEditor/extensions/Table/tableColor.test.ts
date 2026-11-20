import { Editor } from '@tiptap/core'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { configureExtensions } from '../configureExtensions'

import { getEditorColor, setEditorColor } from './tableColor'
import { getSelectedCellColor, getTableTarget } from './tableTarget'

let editor: Editor
beforeEach(() => {
  editor = new Editor({
    extensions: configureExtensions({ features: ['table', 'color', 'backgroundColor'] }),
    content: '<table><tr><td><p>Alpha</p></td><td><p>Beta</p></td></tr></table>',
  })
  editor.commands.setTextSelection(4)
})
afterEach(() => editor.destroy())

describe('toolbar cell colors', () => {
  it.each(['color', 'backgroundColor'] as const)(
    'compares equivalent %s values across cells and inline marks',
    (attribute) => {
      const setColors = (first: string | null, second: string | null, inline = false) => {
        editor.commands.setContent({
          type: 'doc',
          content: [
            {
              type: 'table',
              content: [
                {
                  type: 'tableRow',
                  content: [first, second].map((value, index) => ({
                    type: 'tableCell',
                    attrs: { [attribute]: value },
                    content: [
                      {
                        ...(inline
                          ? {
                              content: [
                                {
                                  type: 'text',
                                  text: 'Text',
                                  marks: [
                                    {
                                      type: 'textStyle',
                                      attrs: { [attribute]: index === 0 ? second : first },
                                    },
                                  ],
                                },
                                { type: 'text', text: ' inherited' },
                              ],
                            }
                          : {}),
                        type: 'paragraph',
                      },
                    ],
                  })),
                },
              ],
            },
          ],
        })
        const positions: number[] = []
        editor.state.doc.descendants((node, pos) => {
          if (node.type.name === 'tableCell') positions.push(pos)
        })
        editor.commands.setCellSelection({ anchorCell: positions[0], headCell: positions[1] })
      }
      for (const inline of [false, true]) {
        setColors('#0077c7', 'rgb(0, 119, 199)', inline)
        expect(getSelectedCellColor(editor, attribute)).not.toBeNull()
        expect(getEditorColor(editor, attribute)).not.toBeNull()
        setColors('#ABC', '#aabbcc', inline)
        expect(getSelectedCellColor(editor, attribute)).not.toBeNull()
        setColors('#0077c7', '#ff0000', inline)
        expect(getSelectedCellColor(editor, attribute)).toBeNull()
      }
      setColors('#0077c7', null)
      expect(getSelectedCellColor(editor, attribute)).toBeNull()
      setColors('#0077c7', 'rgba(0, 119, 199, 0.5)')
      expect(getSelectedCellColor(editor, attribute)).toBeNull()
      setColors('#0077c7', 'rgba(0, 119, 199, 1)')
      expect(getSelectedCellColor(editor, attribute)).not.toBeNull()
    },
  )
  it('reads cell appearance at the caret and updates the cell from the toolbar', () => {
    editor.commands.setCellAttribute('color', '#0077c7')
    expect(getEditorColor(editor, 'color')).toBe('#0077c7')
    setEditorColor(editor, 'color', '#ff0000')
    expect(editor.state.doc.nodeAt(getTableTarget(editor)!.pos)?.attrs.color).toBe('#ff0000')
    setEditorColor(editor, 'color', null)
    expect(getEditorColor(editor, 'color')).toBeNull()
  })
  it('updates every selected cell and reports mixed colors as unset', () => {
    const target = getTableTarget(editor)!
    editor.commands.setCellAttribute('backgroundColor', '#fde2ea')
    editor.commands.setCellSelection({
      anchorCell: target.pos,
      headCell: target.tablePos + 1 + target.map.map[1],
    })
    expect(getEditorColor(editor, 'backgroundColor')).toBeNull()
    setEditorColor(editor, 'backgroundColor', '#d2e5f5')
    expect(getEditorColor(editor, 'backgroundColor')).toBe('#d2e5f5')
    getTableTarget(editor)!.table.firstChild!.forEach((cell) =>
      expect(cell.attrs.backgroundColor).toBe('#d2e5f5'),
    )
  })
  it('reports inline text colors in the cell menu and replaces overrides on a cell change', () => {
    editor.commands.setCellAttribute('color', '#0077c7')
    editor.commands.setTextSelection({ from: 4, to: 9 })
    setEditorColor(editor, 'color', '#008000')
    const pos = getTableTarget(editor)!.pos
    editor.commands.setCellSelection({ anchorCell: pos })
    expect(getSelectedCellColor(editor, 'color')).toBe('#008000')
    expect(getEditorColor(editor, 'color')).toBe('#008000')
    setEditorColor(editor, 'color', '#ff0000')
    expect(getSelectedCellColor(editor, 'color')).toBe('#ff0000')
    const cell = editor.state.doc.nodeAt(pos)!
    cell.descendants((node) => {
      expect(
        node.marks.find((mark) => mark.type.name === 'textStyle')?.attrs.color ?? null,
      ).toBeNull()
    })
    editor.commands.undo()
    expect(getSelectedCellColor(editor, 'color')).toBe('#008000')
  })

  it('uses the caret color rather than the whole-cell mixed color', () => {
    editor.commands.setCellAttribute('color', '#0077c7')
    editor.commands.setTextSelection({ from: 4, to: 6 })
    setEditorColor(editor, 'color', '#ff0000')
    editor.commands.setTextSelection(8)
    expect(getEditorColor(editor, 'color')).toBe('#0077c7')
    editor.commands.setTextSelection(5)
    expect(getEditorColor(editor, 'color')).toBe('#ff0000')
    const pos = getTableTarget(editor)!.pos
    editor.commands.setCellSelection({ anchorCell: pos })
    expect(getEditorColor(editor, 'color')).toBeNull()
  })

  it('keeps text-range formatting separate and displays its inline color', () => {
    editor.commands.setCellAttribute('color', '#0077c7')
    editor.commands.setTextSelection({ from: 3, to: 5 })
    setEditorColor(editor, 'color', '#ff0000')
    expect(getEditorColor(editor, 'color')).toBe('#ff0000')
    expect(editor.state.doc.nodeAt(getTableTarget(editor)!.pos)?.attrs.color).toBe('#0077c7')
  })
})
