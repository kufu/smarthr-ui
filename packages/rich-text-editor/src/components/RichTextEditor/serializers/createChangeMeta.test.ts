import { Editor } from '@tiptap/core'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'

import { ALL_FEATURES, configureExtensions } from '../extensions/configureExtensions'

import { createChangeMeta } from './createChangeMeta'

import type { RichTextJSON } from '../types'
import type { Content } from '@tiptap/core'

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

const youtubeDoc: Content = {
  type: 'doc',
  content: [{ type: 'youtube', attrs: { src: 'https://www.youtube.com/watch?v=abcdefghijk' } }],
}

const documents: Array<[string, Content]> = [
  ['空の段落1つ', '<p></p>'],
  ['空の段落が複数', '<p></p><p></p>'],
  ['空の見出し', '<h2></h2>'],
  ['空の箇条書き', '<ul><li><p></p></li></ul>'],
  ['空白だけの段落', '<p>   </p>'],
  ['hardBreak だけの段落', '<p><br></p>'],
  ['画像だけ', '<img src="https://example.com/a.png">'],
  ['水平線だけ', '<hr>'],
  ['YouTube だけ', youtubeDoc],
  ['1つの段落', '<p>hello</p>'],
  ['複数の段落', '<p>1行目</p><p>2行目</p>'],
  ['hardBreak を含む段落', '<p>上<br>下</p>'],
  ['箇条書き', '<ul><li><p>A</p></li><li><p>B</p></li></ul>'],
  ['入れ子の箇条書き', '<ul><li><p>A</p><ul><li><p>A-1</p></li></ul></li></ul>'],
  ['表', '<table><tbody><tr><th>見出し</th><td>セル</td></tr></tbody></table>'],
  ['コードブロックの改行', '<pre><code>a\nb</code></pre>'],
  ['引用', '<blockquote><p>引用</p></blockquote>'],
]

describe('createChangeMeta', () => {
  describe('editor と同じ判定になる', () => {
    it.each(documents)('%s', (_name, content) => {
      const editor = createEditor(content)
      const meta = createChangeMeta(editor.getJSON() as RichTextJSON)

      expect(meta.isEmpty).toBe(editor.isEmpty)
      expect(meta.text).toBe(editor.getText())
      expect(meta.characterCount).toBe(editor.getText({ blockSeparator: '' }).length)
    })
  })

  it('ブロックの区切りは空行になる', () => {
    const meta = createChangeMeta({
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'A' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'B' }] },
      ],
    })

    expect(meta.text).toBe('A\n\nB')
    expect(meta.characterCount).toBe(2)
  })

  it('hardBreak は改行としてテキストに出る', () => {
    const meta = createChangeMeta({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: '上' },
            { type: 'hardBreak' },
            { type: 'text', text: '下' },
          ],
        },
      ],
    })

    expect(meta.text).toBe('上\n下')
  })

  it('テキストが無くても内容があれば空にしない', () => {
    const meta = createChangeMeta({
      type: 'doc',
      content: [{ type: 'image', attrs: { src: 'https://example.com/a.png' } }],
    })

    expect(meta.isEmpty).toBe(false)
    expect(meta.text).toBe('')
  })

  it('渡された snapshot を使う', () => {
    const json: RichTextJSON = {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'hello' }] }],
    }
    const meta = createChangeMeta(json, 5, { isEmpty: false, text: 'snapshot' })

    expect(meta.text).toBe('snapshot')
    expect(meta.characterCount).toBe(5)
  })

  it('snapshot は後続の編集で変化しない', () => {
    const editor = createEditor('<p>hello</p>')
    const json = editor.getJSON() as RichTextJSON
    const meta = createChangeMeta(json, editor.getText({ blockSeparator: '' }).length, {
      isEmpty: editor.isEmpty,
      text: editor.getText(),
    })

    editor.commands.setContent('<p>changed</p>')

    expect(meta.text).toBe('hello')
    expect(meta.isEmpty).toBe(false)
    expect(meta.characterCount).toBe(5)
  })

  it('html は一度だけ生成して使い回す', () => {
    const meta = createChangeMeta({
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'hello' }] }],
    })

    expect(meta.html).toContain('hello')
    expect(meta.html).toBe(meta.html)
  })
})
