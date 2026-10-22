import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useRichTextEditor } from '../hooks/useRichTextEditor'

import { ALL_FEATURES } from './configureExtensions'

import type { RichTextFeature } from '../types'

const paste = async (html: string, features: readonly RichTextFeature[] = ALL_FEATURES) => {
  const { result } = renderHook(() => useRichTextEditor({ features }))
  await waitFor(() => {
    expect(result.current.editor).not.toBeNull()
  })
  const editor = result.current.editor!

  // jsdom には ClipboardEvent が無い
  editor.view.pasteHTML(html, new Event('paste') as ClipboardEvent)

  return editor
}

const textStyleOf = (editor: NonNullable<Awaited<ReturnType<typeof paste>>>, text: string) => {
  let attrs: Record<string, unknown> | null | undefined

  editor.state.doc.descendants((node) => {
    if (node.isText && node.text === text) {
      attrs = node.marks.find((mark) => mark.type.name === 'textStyle')?.attrs ?? null
    }
  })

  return attrs
}

// Google スプレッドシートの貼り付けは、既定と違う文字サイズだけをセルの style に持つ
const SHEETS_TABLE = `<table style="font-size:10pt"><tbody><tr>
<td style="color:#cc1919;font-size:9pt">小さい</td>
<td style="font-size:16pt"><span style="font-size:8pt">内側</span>外側</td>
<td style="color:#cc1919">既定</td>
</tr></tbody></table>`

describe('表のセルの文字サイズを貼り付ける', () => {
  it('セルの文字サイズは、中の文字の文字サイズとして rem で入る', async () => {
    const editor = await paste(SHEETS_TABLE)

    expect(textStyleOf(editor, '小さい')).toEqual(
      expect.objectContaining({ fontSize: '0.75rem', color: null }),
    )
    expect(textStyleOf(editor, '外側')).toEqual(expect.objectContaining({ fontSize: '1.3333rem' }))
  })

  it('セルの中で文字サイズを指定した文字は、その指定が優先される', async () => {
    const editor = await paste(SHEETS_TABLE)

    expect(textStyleOf(editor, '内側')).toEqual(expect.objectContaining({ fontSize: '0.6667rem' }))
  })

  it('表全体の文字サイズは、セルの文字に入らない', async () => {
    const editor = await paste(SHEETS_TABLE)

    expect(textStyleOf(editor, '既定')).toBeNull()
  })

  it('見出しセルの文字サイズも入る', async () => {
    const editor = await paste(
      '<table><tbody><tr><th style="font-size:9pt">見出し</th></tr></tbody></table>',
    )

    expect(textStyleOf(editor, '見出し')).toEqual(expect.objectContaining({ fontSize: '0.75rem' }))
  })

  it('font の一括指定にある文字サイズも入る', async () => {
    const editor = await paste(
      '<table><tbody><tr><td style="font:12px Arial">一括</td></tr></tbody></table>',
    )

    expect(textStyleOf(editor, '一括')).toEqual(expect.objectContaining({ fontSize: '0.75rem' }))
  })

  it('style より前の属性値に > があっても、文字サイズは入る', async () => {
    const editor = await paste(
      '<table><tbody><tr><td data-sheets-value="a>b" style="font-size:9pt">記号</td></tr></tbody></table>',
    )

    expect(textStyleOf(editor, '記号')).toEqual(expect.objectContaining({ fontSize: '0.75rem' }))
  })

  it('セルの末尾の改行は、文字サイズが無いセルと同じく入らない', async () => {
    const editor = await paste(
      '<table><tbody><tr><td style="font-size:12pt">末尾<br></td></tr></tbody></table>',
    )

    expect(editor.getHTML()).not.toContain('<br')
  })

  it('セルの中が段落でも、文字サイズは中の書式と合わせて入る', async () => {
    const editor = await paste(
      '<table><tbody><tr><td style="font-size:9pt"><div><p><span style="color:#ff0000">段落</span></p></div></td></tr></tbody></table>',
    )

    expect(textStyleOf(editor, '段落')).toEqual(
      expect.objectContaining({ fontSize: '0.75rem', color: '#ff0000' }),
    )
  })

  it('文字サイズを許可していなければ、セルの文字サイズは入らない', async () => {
    const editor = await paste(SHEETS_TABLE, ['table'])

    expect(textStyleOf(editor, '小さい')).toBeNull()
  })
})
