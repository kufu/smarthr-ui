import { Editor } from '@tiptap/core'
import { afterEach, describe, expect, it } from 'vitest'

import { serializeToHTML } from '../serializers/serializeToHTML'

import { configureExtensions } from './configureExtensions'
import { createPasteFilter } from './pasteFilter'

import type { RichTextJSON } from '../types'
import type { Content } from '@tiptap/core'
import type { Slice } from '@tiptap/pm/model'

const FEATURES = ['heading', 'bold'] as const

const editors: Editor[] = []
afterEach(() => {
  while (editors.length > 0) editors.pop()?.destroy()
})

const createEditor = (
  content: Content,
  allowedHeadingLevels: ReadonlyArray<1 | 2 | 3 | 4> = [2, 3],
) => {
  const editor = new Editor({
    extensions: configureExtensions({ features: FEATURES, allowedHeadingLevels }),
    content,
  })
  editors.push(editor)

  return editor
}

const H1_JSON: Content = {
  type: 'doc',
  content: [{ type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: '見出し' }] }],
}

const headingLevel = (editor: Editor): number | null => {
  const first = editor.getJSON().content?.[0]

  return first?.type === 'heading' ? (first.attrs?.level as number) : null
}

/** 貼り付け経路と同じフィルタを通す */
const filterPaste = (editor: Editor, html: string, allowed: ReadonlyArray<1 | 2 | 3 | 4>) => {
  const parser = editor.view.someProp('clipboardParser')
  const element = document.createElement('div')
  element.innerHTML = html
  const slice = (parser ?? editor.view.state.schema.cached.domParser).parseSlice(element) as Slice

  return createPasteFilter(FEATURES, allowed)(slice)
}

describe('headingLevels', () => {
  describe('許可外のレベルでも既存の見出しは保つ', () => {
    it('JSON で読み込んだ h1 が h1 のまま表示・出力される', () => {
      const editor = createEditor(H1_JSON)

      expect(headingLevel(editor)).toBe(1)
      expect(editor.view.dom.querySelector('h1')).not.toBeNull()
      expect(editor.getHTML()).toContain('<h1>')
      expect(serializeToHTML(editor.getJSON() as RichTextJSON)).toContain('<h1>')
    })

    it('HTML で読み込んだ h1 が見出しのまま残る', () => {
      const editor = createEditor('<h1>見出し</h1>')

      expect(headingLevel(editor)).toBe(1)
      expect(editor.getHTML()).toContain('<h1>')
    })

    it('許可レベルが空でも既存の見出しは消えない', () => {
      const editor = createEditor(H1_JSON, [])

      expect(headingLevel(editor)).toBe(1)
      expect(editor.getHTML()).toContain('<h1>')
    })
  })

  describe('新しく適用できるのは許可レベルだけ', () => {
    it('許可外のレベルは setHeading で適用されない', () => {
      const editor = createEditor('<p>本文</p>')

      expect(editor.commands.setHeading({ level: 1 })).toBe(false)
      expect(headingLevel(editor)).toBeNull()
    })

    it('許可レベルは setHeading で適用できる', () => {
      const editor = createEditor('<p>本文</p>')

      expect(editor.commands.setHeading({ level: 2 })).toBe(true)
      expect(headingLevel(editor)).toBe(2)
    })

    it('許可外のレベルの toggleHeading で既存の見出しを段落に変えない', () => {
      const editor = createEditor(H1_JSON)

      expect(editor.commands.toggleHeading({ level: 1 })).toBe(false)
      expect(headingLevel(editor)).toBe(1)
    })

    it('許可レベルが空なら適用できない', () => {
      const editor = createEditor('<p>本文</p>', [])

      expect(editor.commands.setHeading({ level: 2 })).toBe(false)
      expect(headingLevel(editor)).toBeNull()
    })

    it('許可外のレベルのショートカットが効かない', () => {
      const editor = createEditor('<p>本文</p>')

      editor.view.dom.dispatchEvent(
        new KeyboardEvent('keydown', { key: '1', ctrlKey: true, altKey: true, bubbles: true }),
      )

      expect(headingLevel(editor)).toBeNull()
    })

    it('許可レベルのショートカットは効く', () => {
      const editor = createEditor('<p>本文</p>')

      editor.view.dom.dispatchEvent(
        new KeyboardEvent('keydown', { key: '2', ctrlKey: true, altKey: true, bubbles: true }),
      )

      expect(headingLevel(editor)).toBe(2)
    })

    it.each([
      ['許可外', '#', null],
      ['許可レベル', '##', 2],
    ])('Markdown 入力: %s', (_name, hashes, expected) => {
      const editor = createEditor(`<p>${hashes}</p>`)
      editor.commands.focus('end')
      const { view } = editor
      view.someProp('handleTextInput', (f) =>
        f(view, view.state.selection.from, view.state.selection.to, ' ', () => view.state.tr),
      )

      expect(headingLevel(editor)).toBe(expected)
    })
  })

  describe('貼り付け', () => {
    it('許可外のレベルの見出しは段落になる', () => {
      const editor = createEditor('<p></p>')
      const slice = filterPaste(editor, '<h1>貼り付け</h1>', [2, 3])

      expect(slice.content.firstChild?.type.name).toBe('paragraph')
      expect(slice.content.firstChild?.textContent).toBe('貼り付け')
    })

    it('許可すれば h1 のまま入る（段落化はフィルタの仕事）', () => {
      const editor = createEditor('<p></p>')
      const slice = filterPaste(editor, '<h1>貼り付け</h1>', [1, 2, 3])

      expect(slice.content.firstChild?.type.name).toBe('heading')
      expect(slice.content.firstChild?.attrs.level).toBe(1)
    })

    it('許可レベルの見出しはそのまま入る', () => {
      const editor = createEditor('<p></p>')
      const slice = filterPaste(editor, '<h2>貼り付け</h2>', [2, 3])

      expect(slice.content.firstChild?.type.name).toBe('heading')
      expect(slice.content.firstChild?.attrs.level).toBe(2)
    })
  })
})
