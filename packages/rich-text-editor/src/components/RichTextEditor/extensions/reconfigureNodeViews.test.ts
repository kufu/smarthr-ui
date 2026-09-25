import { Editor } from '@tiptap/core'
import { CellSelection, TableMap } from '@tiptap/pm/tables'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'

import { addImagePlaceholder, findImagePlaceholderPos } from './Image/imageUploadPlaceholder'
import { configureExtensions } from './configureExtensions'
import { reconfigureEditorOperations, rememberManagedPlugins } from './reconfigureEditorOperations'

import type { RichTextRuntimeOptions } from './runtimeOptions'
import type { RichTextFeature } from '../types'
import type { AnyExtension } from '@tiptap/core'

// jsdom には ResizeObserver が無く、画像の NodeView がマウント時に参照する
beforeAll(() => {
  if (typeof globalThis.ResizeObserver === 'undefined') {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  }
})

const ALL: readonly RichTextFeature[] = ['bold', 'image', 'table', 'link']

const IMAGE_DOC = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'image', attrs: { src: 'https://example.com/a.png' } }],
    },
  ],
}

const TABLE_DOC = {
  type: 'doc',
  content: [
    {
      type: 'table',
      content: [
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'セル' }] }],
            },
          ],
        },
      ],
    },
  ],
}

const WIDE_TABLE_DOC = {
  type: 'doc',
  content: [
    {
      type: 'table',
      content: [
        {
          type: 'tableRow',
          content: ['A', 'B'].map((text) => ({
            type: 'tableCell',
            content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
          })),
        },
      ],
    },
  ],
}

let editor: Editor | null = null

const createEditor = (runtime: RichTextRuntimeOptions, content: unknown) => {
  const element = document.createElement('div')
  document.body.appendChild(element)

  editor = new Editor({
    element,
    extensions: configureExtensions({ getRuntimeOptions: () => runtime }) as AnyExtension[],
    content: content as never,
  })
  rememberManagedPlugins(editor)

  return editor
}

afterEach(() => {
  editor?.destroy()
  editor = null
})

const hasResizeHandle = (target: Editor) =>
  target.view.dom.querySelector('[data-resize-handle]') !== null

const cellText = (target: Editor) => target.view.dom.querySelector('td')?.textContent ?? null

describe('features の変更と NodeView', () => {
  it('image を外すと画像のリサイズハンドルが消え、戻すと出る', () => {
    const runtime: RichTextRuntimeOptions = { features: ALL }
    const target = createEditor(runtime, IMAGE_DOC)

    expect(hasResizeHandle(target)).toBe(true)

    runtime.features = ALL.filter((f) => f !== 'image')
    reconfigureEditorOperations(target)
    expect(hasResizeHandle(target)).toBe(false)

    runtime.features = ALL
    reconfigureEditorOperations(target)
    expect(hasResizeHandle(target)).toBe(true)
  })

  it('image を外しても画像そのものは残る', () => {
    const runtime: RichTextRuntimeOptions = { features: ALL }
    const target = createEditor(runtime, IMAGE_DOC)

    runtime.features = []
    reconfigureEditorOperations(target)

    expect(target.view.dom.querySelector('img')?.getAttribute('src')).toBe(
      'https://example.com/a.png',
    )
    expect(JSON.stringify(target.getJSON())).toContain('https://example.com/a.png')
  })

  it('table を外しても表のデータと表示が残る', () => {
    const runtime: RichTextRuntimeOptions = { features: ALL }
    const target = createEditor(runtime, TABLE_DOC)

    expect(cellText(target)).toBe('セル')

    runtime.features = []
    reconfigureEditorOperations(target)
    expect(cellText(target)).toBe('セル')

    runtime.features = ALL
    reconfigureEditorOperations(target)
    expect(cellText(target)).toBe('セル')
    expect(JSON.stringify(target.getJSON())).toContain('tableCell')
  })

  it('再構成で storage の参照を失わない', () => {
    const runtime: RichTextRuntimeOptions = { features: ALL }
    const target = createEditor(runtime, TABLE_DOC)
    const openActionsMenu = () => {}

    target.storage.linkShortcut!.openLinkPopover = openActionsMenu
    target.storage.table!.openActionsMenu = openActionsMenu

    runtime.features = []
    reconfigureEditorOperations(target)

    expect(target.storage.linkShortcut!.openLinkPopover).toBe(openActionsMenu)
    expect(target.storage.table!.openActionsMenu).toBe(openActionsMenu)
  })

  it('再構成で複数セル選択を失わない', () => {
    const runtime: RichTextRuntimeOptions = { features: ALL }
    const target = createEditor(runtime, WIDE_TABLE_DOC)
    const map = TableMap.get(target.state.doc.child(0))
    const tableStart = 1

    target.commands.setCellSelection({
      anchorCell: tableStart + map.map[0],
      headCell: tableStart + map.map[1],
    })
    expect(target.state.selection).toBeInstanceOf(CellSelection)

    runtime.features = []
    reconfigureEditorOperations(target)

    expect(target.state.selection).toBeInstanceOf(CellSelection)
  })

  it('再構成でアップロード中のプレースホルダを失わない', () => {
    const runtime: RichTextRuntimeOptions = { features: ALL }
    const target = createEditor(runtime, IMAGE_DOC)
    const { id } = addImagePlaceholder(target.view, 1)

    expect(findImagePlaceholderPos(target.view, id)).not.toBeNull()

    runtime.features = []
    reconfigureEditorOperations(target)

    expect(findImagePlaceholderPos(target.view, id)).not.toBeNull()
  })
})
