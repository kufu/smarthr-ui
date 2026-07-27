'use client'

import { useCallback } from 'react'

import type { Editor } from '@tiptap/react'

export const useTableActions = (editor: Editor) => {
  const addRowBefore = useCallback(() => {
    editor.chain().focus().addRowBefore().run()
  }, [editor])

  const addRowAfter = useCallback(() => {
    editor.chain().focus().addRowAfter().run()
  }, [editor])

  const addColumnBefore = useCallback(() => {
    editor.chain().focus().addColumnBefore().run()
  }, [editor])

  const addColumnAfter = useCallback(() => {
    editor.chain().focus().addColumnAfter().run()
  }, [editor])

  const deleteRow = useCallback(() => {
    editor.chain().focus().deleteRow().run()
  }, [editor])

  const deleteColumn = useCallback(() => {
    editor.chain().focus().deleteColumn().run()
  }, [editor])

  const mergeCells = useCallback(() => {
    editor.chain().focus().mergeCells().run()
  }, [editor])

  const splitCell = useCallback(() => {
    editor.chain().focus().splitCell().run()
  }, [editor])

  const deleteTable = useCallback(() => {
    editor.chain().focus().deleteTable().run()
  }, [editor])

  const toggleHeaderRow = useCallback(() => {
    editor.chain().focus().toggleHeaderRow().run()
  }, [editor])

  const toggleHeaderColumn = useCallback(() => {
    editor.chain().focus().toggleHeaderColumn().run()
  }, [editor])

  const toggleHeaderCell = useCallback(() => {
    editor.chain().focus().toggleHeaderCell().run()
  }, [editor])

  return {
    addRowBefore,
    addRowAfter,
    addColumnBefore,
    addColumnAfter,
    deleteRow,
    deleteColumn,
    mergeCells,
    splitCell,
    deleteTable,
    toggleHeaderRow,
    toggleHeaderColumn,
    toggleHeaderCell,
  }
}
