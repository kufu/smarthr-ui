'use client'

import { NodeSelection } from '@tiptap/pm/state'
import { type Editor, useEditorState } from '@tiptap/react'

const findTableNode = (e: Editor) => {
  const { $from } = e.state.selection
  for (let depth = $from.depth; depth > 0; depth--) {
    const node = $from.node(depth)
    if (node.type.name === 'table') return node
  }
  return null
}

const detectHeaderRow = (e: Editor): boolean => {
  const table = findTableNode(e)
  if (!table || table.childCount === 0) return false
  const firstRow = table.child(0)
  if (firstRow.childCount === 0) return false
  const lastCell = firstRow.child(firstRow.childCount - 1)
  return lastCell.type.name === 'tableHeader'
}

const detectHeaderColumn = (e: Editor): boolean => {
  const table = findTableNode(e)
  if (!table || table.childCount < 2) return false
  const secondRow = table.child(1)
  if (secondRow.childCount === 0) return false
  return secondRow.child(0).type.name === 'tableHeader'
}

const canRun = (editor: Editor, command: string): boolean => {
  try {
    return (
      (
        editor.can().chain().focus() as unknown as Record<
          string,
          (() => { run: () => boolean }) | undefined
        >
      )
        [command]?.()
        .run() ?? false
    )
  } catch {
    return false
  }
}

export const useToolbarState = (editor: Editor) =>
  useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      isBold: e.isActive('bold'),
      isItalic: e.isActive('italic'),
      isStrike: e.isActive('strike'),
      isUnderline: e.isActive('underline'),
      isCode: e.isActive('code'),
      isCodeBlock: e.isActive('codeBlock'),
      isBulletList: e.isActive('bulletList'),
      isOrderedList: e.isActive('orderedList'),
      isBlockquote: e.isActive('blockquote'),
      isHeading1: e.isActive('heading', { level: 1 }),
      isHeading2: e.isActive('heading', { level: 2 }),
      isHeading3: e.isActive('heading', { level: 3 }),
      isHeading4: e.isActive('heading', { level: 4 }),
      currentHeadingLevel: (e.isActive('heading', { level: 1 })
        ? 1
        : e.isActive('heading', { level: 2 })
          ? 2
          : e.isActive('heading', { level: 3 })
            ? 3
            : e.isActive('heading', { level: 4 })
              ? 4
              : null) as 1 | 2 | 3 | 4 | null,
      isLink: e.isActive('link'),
      currentColor: (e.getAttributes('textStyle').color as string) ?? null,
      currentBackgroundColor: (e.getAttributes('textStyle').backgroundColor as string) ?? null,
      currentFontSize: (e.getAttributes('textStyle').fontSize as string) ?? null,
      currentTextAlign:
        (e.getAttributes('paragraph').textAlign as string) ??
        (e.getAttributes('heading').textAlign as string) ??
        null,
      isInHeading: e.isActive('heading'),

      canBold: canRun(e, 'toggleBold'),
      canItalic: canRun(e, 'toggleItalic'),
      canStrike: canRun(e, 'toggleStrike'),
      canUnderline: canRun(e, 'toggleUnderline'),
      canCode: canRun(e, 'toggleCode'),
      canCodeBlock: canRun(e, 'toggleCodeBlock'),
      canBulletList: canRun(e, 'toggleBulletList'),
      canOrderedList: canRun(e, 'toggleOrderedList'),
      canBlockquote: canRun(e, 'toggleBlockquote'),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),

      isNodeSelected: e.state.selection instanceof NodeSelection,

      isInTable: e.isActive('table'),
      hasHeaderRow: detectHeaderRow(e),
      hasHeaderColumn: detectHeaderColumn(e),
      canAddColumnBefore: canRun(e, 'addColumnBefore'),
      canAddColumnAfter: canRun(e, 'addColumnAfter'),
      canDeleteColumn: canRun(e, 'deleteColumn'),
      canAddRowBefore: canRun(e, 'addRowBefore'),
      canAddRowAfter: canRun(e, 'addRowAfter'),
      canDeleteRow: canRun(e, 'deleteRow'),
      canDeleteTable: canRun(e, 'deleteTable'),
      canMergeCells: canRun(e, 'mergeCells'),
      canSplitCell: canRun(e, 'splitCell'),
      canToggleHeaderCell: canRun(e, 'toggleHeaderCell'),
    }),
  })
