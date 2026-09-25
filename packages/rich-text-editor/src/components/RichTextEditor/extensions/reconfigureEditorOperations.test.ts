import { Editor } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { configureExtensions } from './configureExtensions'
import { reconfigureEditorOperations, rememberManagedPlugins } from './reconfigureEditorOperations'

import type { HeadingLevel } from './configureHeading'
import type { RichTextRuntimeOptions } from './runtimeOptions'
import type { RichTextFeature } from '../types'
import type { AnyExtension } from '@tiptap/core'

const ALL: readonly RichTextFeature[] = ['bold', 'italic', 'link', 'heading', 'image', 'table']

let editor: Editor | null = null

const createEditor = (runtime: RichTextRuntimeOptions) => {
  const element = document.createElement('div')
  document.body.appendChild(element)

  editor = new Editor({
    element,
    extensions: configureExtensions({ getRuntimeOptions: () => runtime }) as AnyExtension[],
    content: {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'あいう' }] }],
    },
  })
  rememberManagedPlugins(editor)

  return editor
}

afterEach(() => {
  editor?.destroy()
  editor = null
})

/** Mod-<key> を押す。jsdom では ctrlKey が Mod として解釈される */
const pressMod = (target: Editor, key: string, alt = false) => {
  target.commands.selectAll()
  target.view.dom.dispatchEvent(
    new KeyboardEvent('keydown', {
      key,
      ctrlKey: true,
      altKey: alt,
      bubbles: true,
      cancelable: true,
    }),
  )
}

const hasBold = (target: Editor) => JSON.stringify(target.getJSON()).includes('"type":"bold"')

const headingLevels = (target: Editor) =>
  target
    .getJSON()
    .content?.filter((n) => n.type === 'heading')
    .map((n) => n.attrs?.level) ?? []

describe('reconfigureEditorOperations', () => {
  it('features の変更でショートカットの可否が切り替わる', () => {
    const runtime: RichTextRuntimeOptions = { features: ALL }
    const target = createEditor(runtime)

    pressMod(target, 'b')
    expect(hasBold(target)).toBe(true)

    // 太字を外す
    target.commands.selectAll()
    target.commands.unsetMark('bold')
    runtime.features = ALL.filter((f) => f !== 'bold')
    reconfigureEditorOperations(target)

    pressMod(target, 'b')
    expect(hasBold(target)).toBe(false)

    // 戻す
    runtime.features = ALL
    reconfigureEditorOperations(target)

    pressMod(target, 'b')
    expect(hasBold(target)).toBe(true)
  })

  it('allowedHeadingLevels の変更がショートカットへ反映される', () => {
    const runtime: RichTextRuntimeOptions = {
      features: ALL,
      allowedHeadingLevels: [2] as readonly HeadingLevel[],
    }
    const target = createEditor(runtime)

    pressMod(target, '1', true)
    expect(headingLevels(target)).toEqual([])

    runtime.allowedHeadingLevels = [1, 2]
    reconfigureEditorOperations(target)

    pressMod(target, '1', true)
    expect(headingLevels(target)).toEqual([1])
  })

  it('再構成で本文・選択・Undo を失わない', () => {
    const runtime: RichTextRuntimeOptions = { features: ALL }
    const target = createEditor(runtime)

    target.commands.insertContentAt(1, 'かきく')
    const before = JSON.stringify(target.getJSON())
    const selectionBefore = { from: target.state.selection.from, to: target.state.selection.to }

    runtime.features = ALL.filter((f) => f !== 'bold')
    reconfigureEditorOperations(target)

    expect(JSON.stringify(target.getJSON())).toBe(before)
    expect(target.state.selection.from).toBe(selectionBefore.from)
    expect(target.state.selection.to).toBe(selectionBefore.to)

    target.commands.undo()
    expect(JSON.stringify(target.getJSON())).not.toBe(before)
  })

  it('再構成で schema を作り直さない', () => {
    const runtime: RichTextRuntimeOptions = { features: ALL }
    const target = createEditor(runtime)
    const schema = target.schema

    runtime.features = []
    reconfigureEditorOperations(target)

    expect(target.schema).toBe(schema)
  })

  it('再構成では変更通知を出さない', () => {
    const runtime: RichTextRuntimeOptions = { features: ALL }
    const target = createEditor(runtime)
    const onUpdate = vi.fn()
    target.on('update', onUpdate)

    runtime.features = []
    reconfigureEditorOperations(target)

    expect(onUpdate).not.toHaveBeenCalled()
  })

  it('plugin の本数が再構成で増えない', () => {
    const runtime: RichTextRuntimeOptions = { features: ALL }
    const target = createEditor(runtime)
    const before = target.state.plugins.length

    reconfigureEditorOperations(target)
    reconfigureEditorOperations(target)

    expect(target.state.plugins.length).toBe(before)
  })

  it('registerPlugin で追加された外部 plugin を捨てない', () => {
    const runtime: RichTextRuntimeOptions = { features: ALL }
    const target = createEditor(runtime)
    const externalKey = new PluginKey('外部プラグイン')
    target.registerPlugin(new Plugin({ key: externalKey }))

    runtime.features = []
    reconfigureEditorOperations(target)

    expect(externalKey.get(target.state)).toBeDefined()
  })

  it('destroy 済みの editor では何もしない', () => {
    const runtime: RichTextRuntimeOptions = { features: ALL }
    const target = createEditor(runtime)
    target.destroy()
    editor = null

    expect(() => reconfigureEditorOperations(target)).not.toThrow()
  })
})
