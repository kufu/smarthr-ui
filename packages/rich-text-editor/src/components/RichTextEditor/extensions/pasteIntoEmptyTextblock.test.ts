import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useRichTextEditor } from '../hooks/useRichTextEditor'

import type { RichTextFeature } from '../types'
import type { Editor, JSONContent } from '@tiptap/core'

const FEATURES: RichTextFeature[] = [
  'heading',
  'textAlign',
  'lineHeight',
  'backgroundColor',
  'blockBackgroundColor',
]

// 16 進で書かないのは、HTML から読んだ色が rgb() 表記になるため
const PASTED_GREEN = 'rgb(103, 178, 127)'
const PASTED_BLUE = 'rgb(0, 119, 199)'
const BAND = '#f1e8ce'

const bandHTML = (text: string, color = PASTED_GREEN) =>
  `<p data-block-background="" style="background-color: ${color}">${text}</p>`

const p = (text?: string, attrs?: Record<string, unknown>): JSONContent => ({
  ...(attrs ? { attrs } : {}),
  ...(text ? { content: [{ type: 'text', text }] } : {}),
  type: 'paragraph',
})

const renderEditor = async (content: JSONContent[], features = FEATURES) => {
  const { result } = renderHook(() =>
    useRichTextEditor({ features, defaultValue: { type: 'doc', content } }),
  )
  await waitFor(() => {
    expect(result.current.editor).not.toBeNull()
  })

  return result.current.editor!
}

const caretInFirstEmptyBlock = (editor: Editor) => {
  let caret = -1

  editor.state.doc.descendants((node, pos) => {
    if (caret === -1 && node.isTextblock && node.content.size === 0) caret = pos + 1
  })

  editor.commands.setTextSelection(caret)
}

const pasteHTML = (editor: Editor, html: string) => {
  // jsdom には ClipboardEvent が無い
  editor.view.pasteHTML(html, new Event('paste') as ClipboardEvent)
}

const attrsOf = (editor: Editor, text: string) => {
  const node = editor.state.doc.children.find((child) => child.textContent === text)

  if (!node) throw new Error(`${text} が見つかりません`)

  return node.attrs
}

describe('空の段落・見出しへの貼り付け', () => {
  it.each([
    ['帯', bandHTML('貼り付け'), { blockBackgroundColor: PASTED_GREEN }],
    ['中央揃え', '<p style="text-align: center">貼り付け</p>', { textAlign: 'center' }],
    ['行送り', '<p style="line-height: 2">貼り付け</p>', { lineHeight: '2' }],
  ])('%s のある段落を 1 つだけ貼ると、その属性が残る', async (_, html, expected) => {
    const editor = await renderEditor([p('前'), p(), p('後')])
    caretInFirstEmptyBlock(editor)

    pasteHTML(editor, html)

    expect(attrsOf(editor, '貼り付け')).toMatchObject(expected)
  })

  it('帯の違う段落を 2 つ貼ると、先頭の段落もそれぞれの帯を持つ', async () => {
    const editor = await renderEditor([p('前'), p(), p('後')])
    caretInFirstEmptyBlock(editor)

    pasteHTML(editor, `${bandHTML('1つ目')}${bandHTML('2つ目', PASTED_BLUE)}`)

    expect(attrsOf(editor, '1つ目').blockBackgroundColor).toBe(PASTED_GREEN)
    expect(attrsOf(editor, '2つ目').blockBackgroundColor).toBe(PASTED_BLUE)
  })

  it('帯のある空の段落にプレーンなテキストを貼ると、帯が残る', async () => {
    const editor = await renderEditor([p('前'), p(undefined, { blockBackgroundColor: BAND })])
    caretInFirstEmptyBlock(editor)

    // jsdom には ClipboardEvent が無い
    editor.view.pasteText('貼り付け', new Event('paste') as ClipboardEvent)

    expect(attrsOf(editor, '貼り付け').blockBackgroundColor).toBe(BAND)
  })

  it('帯のある空の段落に中央揃えの段落を貼ると、帯は残り、中央揃えが付く', async () => {
    const editor = await renderEditor([p('前'), p(undefined, { blockBackgroundColor: BAND })])
    caretInFirstEmptyBlock(editor)

    pasteHTML(editor, '<p style="text-align: center">貼り付け</p>')

    expect(attrsOf(editor, '貼り付け')).toMatchObject({
      blockBackgroundColor: BAND,
      textAlign: 'center',
    })
  })

  it('帯のある空の見出しに帯の無い見出しを貼ると、帯が残る', async () => {
    const editor = await renderEditor([
      p('前'),
      { type: 'heading', attrs: { level: 2, blockBackgroundColor: BAND } },
    ])
    caretInFirstEmptyBlock(editor)

    pasteHTML(editor, '<h2>見出し</h2>')

    expect(attrsOf(editor, '見出し')).toMatchObject({ level: 2, blockBackgroundColor: BAND })
  })

  it('空でない段落の途中に貼ると、今の段落の属性のまま', async () => {
    const editor = await renderEditor([p('前後', { blockBackgroundColor: BAND })])
    editor.commands.setTextSelection(2)

    pasteHTML(
      editor,
      `<p data-block-background="" style="background-color: ${PASTED_GREEN}; text-align: center">貼り付け</p>`,
    )

    expect(attrsOf(editor, '前貼り付け後')).toMatchObject({
      blockBackgroundColor: BAND,
      textAlign: null,
    })
  })

  it('features で許可していない属性は、空の段落に貼っても入らない', async () => {
    const editor = await renderEditor([p('前'), p(), p('後')], ['backgroundColor'])
    caretInFirstEmptyBlock(editor)

    pasteHTML(
      editor,
      `<p data-block-background="" style="background-color: ${PASTED_GREEN}; text-align: center; line-height: 2">貼り付け</p>`,
    )

    expect(attrsOf(editor, '貼り付け')).toMatchObject({
      blockBackgroundColor: null,
      textAlign: null,
      lineHeight: null,
    })
  })
})
