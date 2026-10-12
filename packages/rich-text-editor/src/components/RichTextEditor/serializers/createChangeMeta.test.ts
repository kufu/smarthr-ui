import { Editor } from '@tiptap/core'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import { ALL_FEATURES, configureExtensions } from '../extensions/configureExtensions'

import { createChangeMeta } from './createChangeMeta'
import { serializeToHTML } from './serializeToHTML'

import type { Content } from '@tiptap/core'

vi.mock('./serializeToHTML', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>

  return { ...actual, serializeToHTML: vi.fn(actual.serializeToHTML as typeof serializeToHTML) }
})

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

const editors: Editor[] = []
afterEach(() => {
  while (editors.length > 0) editors.pop()?.destroy()
})

const createEditor = (content: Content) => {
  const editor = new Editor({
    extensions: configureExtensions({ features: ALL_FEATURES }),
    content,
  })
  editors.push(editor)

  return editor
}

describe('createChangeMeta', () => {
  it('空の段落だけの文書は空で、文字数は 0', () => {
    const meta = createChangeMeta(createEditor('<p></p>'))

    expect(meta.isEmpty).toBe(true)
    expect(meta.text).toBe('')
    expect(meta.characterCount).toBe(0)
  })

  it('ブロックの区切りは空行になり、文字数には数えない', () => {
    const meta = createChangeMeta(createEditor('<p>A</p><p>B</p>'))

    expect(meta.text).toBe('A\n\nB')
    expect(meta.characterCount).toBe(2)
  })

  it('hardBreak は改行としてテキストに出る', () => {
    expect(createChangeMeta(createEditor('<p>上<br>下</p>')).text).toBe('上\n下')
  })

  it('テキストが無くても内容があれば空にしない', () => {
    const meta = createChangeMeta(createEditor('<img src="https://example.com/a.png">'))

    expect(meta.isEmpty).toBe(false)
    expect(meta.text).toBe('')
  })

  it('後続の編集で中身が変わらない', () => {
    const editor = createEditor('<p>hello</p>')
    const meta = createChangeMeta(editor)

    editor.commands.setContent('<p>changed</p>')

    expect(meta.json.content?.[0]?.content?.[0]?.text).toBe('hello')
    expect(meta.html).toBe('<p>hello</p>')
    expect(meta.text).toBe('hello')
    expect(meta.isEmpty).toBe(false)
    expect(meta.characterCount).toBe(5)
  })

  it('json を書き換えても文書は変わらない', () => {
    const editor = createEditor('<p>hello</p>')
    const meta = createChangeMeta(editor)

    meta.json.content = []

    expect(editor.getText()).toBe('hello')
  })

  it('html は読まれたときに一度だけ生成して使い回す', () => {
    const editor = createEditor('<p>hello</p>')
    const serialize = vi.mocked(serializeToHTML)
    serialize.mockClear()
    const meta = createChangeMeta(editor)

    expect(serialize).not.toHaveBeenCalled()

    expect(meta.html).toBe('<p>hello</p>')
    expect(meta.html).toBe('<p>hello</p>')
    expect(serialize).toHaveBeenCalledTimes(1)
  })
})
