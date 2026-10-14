import { renderHook, waitFor } from '@testing-library/react'
import { Editor } from '@tiptap/core'
import { DOMParser, Slice } from '@tiptap/pm/model'
import { describe, expect, it } from 'vitest'

import { useRichTextEditor } from '../hooks/useRichTextEditor'

import { ALL_FEATURES, configureExtensions } from './configureExtensions'
import { createPasteFilter } from './pasteFilter'

import type { RichTextFeature } from '../types'
import type { AnyExtension } from '@tiptap/core'
import type { Schema } from '@tiptap/pm/model'

const createSchema = (): Schema => {
  const element = document.createElement('div')
  document.body.appendChild(element)
  const editor = new Editor({
    element,
    extensions: configureExtensions({ features: ALL_FEATURES }) as AnyExtension[],
  })
  const schema = editor.schema
  editor.destroy()

  return schema
}

const schema = createSchema()

type SliceJSON = {
  content: unknown[]
  openStart?: number
  openEnd?: number
}

const filterSlice = (features: readonly RichTextFeature[], sliceJson: SliceJSON) => {
  const slice = Slice.fromJSON(schema, sliceJson)
  const result = createPasteFilter(features)(slice)

  return {
    content: result.content.toJSON() as unknown,
    openStart: result.openStart,
    openEnd: result.openEnd,
  }
}

const paragraph = (content: unknown[]) => ({ type: 'paragraph', content })
const text = (value: string, marks?: unknown[]) => ({
  ...(marks ? { marks } : {}),
  type: 'text',
  text: value,
})

describe('createPasteFilter', () => {
  describe('mark', () => {
    it('features 外の mark を落としてテキストは残す', () => {
      const result = filterSlice(['bold'], {
        content: [
          paragraph([text('太字', [{ type: 'bold' }]), text('斜体', [{ type: 'italic' }])]),
        ],
      })

      expect(JSON.stringify(result.content)).toContain('bold')
      expect(JSON.stringify(result.content)).not.toContain('italic')
      expect(JSON.stringify(result.content)).toContain('斜体')
    })

    it('features 外の link を落とす', () => {
      const result = filterSlice(['bold'], {
        content: [
          paragraph([text('リンク', [{ type: 'link', attrs: { href: 'https://example.com' } }])]),
        ],
      })

      expect(JSON.stringify(result.content)).not.toContain('link')
      expect(JSON.stringify(result.content)).toContain('リンク')
    })

    it('features 内の mark はそのまま残す', () => {
      const result = filterSlice(['bold', 'italic'], {
        content: [
          paragraph([text('太字', [{ type: 'bold' }]), text('斜体', [{ type: 'italic' }])]),
        ],
      })

      expect(JSON.stringify(result.content)).toContain('bold')
      expect(JSON.stringify(result.content)).toContain('italic')
    })
  })

  describe('textStyle の属性', () => {
    it('features 外の色を落とし、features 内の文字サイズは残す', () => {
      const result = filterSlice(['fontSize'], {
        content: [
          paragraph([
            text('装飾', [{ type: 'textStyle', attrs: { color: '#ff0000', fontSize: '20px' } }]),
          ]),
        ],
      })
      const json = JSON.stringify(result.content)

      expect(json).not.toContain('#ff0000')
      expect(json).toContain('1.25rem')
    })

    // Google ドキュメントから貼り付けると pt のまま入ってくる
    it('文字サイズは rem にそろえる', () => {
      const result = filterSlice(['fontSize'], {
        content: [paragraph([text('本文', [{ type: 'textStyle', attrs: { fontSize: '11pt' } }])])],
      })
      const json = JSON.stringify(result.content)

      expect(json).toContain('0.9167rem')
      expect(json).not.toContain('11pt')
    })

    it('換算できない文字サイズは落とす', () => {
      const result = filterSlice(['fontSize'], {
        content: [paragraph([text('本文', [{ type: 'textStyle', attrs: { fontSize: '150%' } }])])],
      })

      expect(JSON.stringify(result.content)).not.toContain('textStyle')
      expect(JSON.stringify(result.content)).toContain('本文')
    })

    it('すべての属性が features 外なら textStyle 自体を落とす', () => {
      const result = filterSlice(['bold'], {
        content: [paragraph([text('赤字', [{ type: 'textStyle', attrs: { color: '#ff0000' } }])])],
      })

      expect(JSON.stringify(result.content)).not.toContain('textStyle')
      expect(JSON.stringify(result.content)).toContain('赤字')
    })
  })

  describe('node の属性', () => {
    it('features 外の textAlign / lineHeight を落とす', () => {
      const result = filterSlice(['bold'], {
        content: [
          {
            type: 'paragraph',
            attrs: { textAlign: 'center', lineHeight: '2' },
            content: [text('中央')],
          },
        ],
      })
      const json = JSON.stringify(result.content)

      expect(json).not.toContain('center')
      expect(json).not.toContain('"2"')
      expect(json).toContain('中央')
    })

    it('features 内の textAlign は残す', () => {
      const result = filterSlice(['textAlign'], {
        content: [{ type: 'paragraph', attrs: { textAlign: 'center' }, content: [text('中央')] }],
      })

      expect(JSON.stringify(result.content)).toContain('center')
    })
  })

  describe('node', () => {
    it('features 外の見出しは段落へ降格してテキストを残す', () => {
      const result = filterSlice(['bold'], {
        content: [{ type: 'heading', attrs: { level: 2 }, content: [text('見出し')] }],
      })

      expect(JSON.stringify(result.content)).not.toContain('heading')
      expect(JSON.stringify(result.content)).toContain('見出し')
      expect((result.content as Array<{ type: string }>)[0].type).toBe('paragraph')
    })

    it('features 外のテーブルは中身の段落へ平坦化する', () => {
      const result = filterSlice(['bold'], {
        content: [
          {
            type: 'table',
            content: [
              {
                type: 'tableRow',
                content: [
                  { type: 'tableHeader', content: [paragraph([text('見出しセル')])] },
                  { type: 'tableCell', content: [paragraph([text('セル')])] },
                ],
              },
            ],
          },
        ],
      })
      const json = JSON.stringify(result.content)

      expect(json).not.toContain('table')
      expect(json).toContain('見出しセル')
      expect(json).toContain('セル')
      expect(result.content).toHaveLength(2)
    })

    it('features 外のリストは段落へ平坦化する', () => {
      const result = filterSlice(['bold'], {
        content: [
          {
            type: 'bulletList',
            content: [
              { type: 'listItem', content: [paragraph([text('1つ目')])] },
              { type: 'listItem', content: [paragraph([text('2つ目')])] },
            ],
          },
        ],
      })
      const json = JSON.stringify(result.content)

      expect(json).not.toContain('bulletList')
      expect(json).not.toContain('listItem')
      expect(json).toContain('1つ目')
      expect(result.content).toHaveLength(2)
    })

    it('features 外の画像・水平線は削除する', () => {
      const result = filterSlice(['bold'], {
        content: [
          { type: 'image', attrs: { src: 'https://example.com/a.png' } },
          { type: 'horizontalRule' },
          paragraph([text('本文')]),
        ],
      })
      const json = JSON.stringify(result.content)

      expect(json).not.toContain('image')
      expect(json).not.toContain('horizontalRule')
      expect(json).toContain('本文')
    })

    it('features 外の見出しを段落へ降格しても、中の mark は features で絞る', () => {
      const result = filterSlice(['bold'], {
        content: [
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [text('太字', [{ type: 'bold' }]), text('斜体', [{ type: 'italic' }])],
          },
        ],
      })

      expect(result.content).toEqual([
        {
          type: 'paragraph',
          attrs: expect.anything(),
          content: [{ type: 'text', marks: [{ type: 'bold' }], text: '太字' }, text('斜体')],
        },
      ])
    })

    const tableWithList = {
      content: [
        {
          type: 'table',
          content: [
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  content: [
                    {
                      type: 'bulletList',
                      content: [{ type: 'listItem', content: [paragraph([text('項目')])] }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }

    it('features 外のテーブルの中の features 外のリストは、段落まで平坦化する', () => {
      const result = filterSlice(['bold'], tableWithList)

      expect(result.content).toEqual([
        { type: 'paragraph', attrs: expect.anything(), content: [text('項目')] },
      ])
    })

    it('features 外のテーブルの中の features 内のリストは、リストのまま残す', () => {
      const result = filterSlice(['bulletList'], tableWithList)

      expect(result.content).toEqual([
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [{ type: 'paragraph', attrs: expect.anything(), content: [text('項目')] }],
            },
          ],
        },
      ])
    })

    it('features 外の YouTube は削除する', () => {
      const result = filterSlice(['bold'], {
        content: [
          { type: 'youtube', attrs: { src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' } },
          paragraph([text('本文')]),
        ],
      })

      expect(JSON.stringify(result.content)).not.toContain('youtube')
      expect(JSON.stringify(result.content)).toContain('本文')
    })

    it('改行は features に関係なく残す', () => {
      const result = filterSlice(['bold'], {
        content: [paragraph([text('1行目'), { type: 'hardBreak' }, text('2行目')])],
      })

      expect(JSON.stringify(result.content)).toContain('hardBreak')
    })

    it('features に heading が無ければ、許可レベルを渡しても段落へ降格する', () => {
      const slice = Slice.fromJSON(schema, {
        content: [{ type: 'heading', attrs: { level: 2 }, content: [text('見出し')] }],
      })

      const result = createPasteFilter(['bold'], [2])(slice)

      expect(result.content.firstChild?.type.name).toBe('paragraph')
    })

    it('features 内のテーブルはそのまま残す', () => {
      const result = filterSlice(['table'], {
        content: [
          {
            type: 'table',
            content: [
              {
                type: 'tableRow',
                content: [{ type: 'tableCell', content: [paragraph([text('セル')])] }],
              },
            ],
          },
        ],
      })

      expect(JSON.stringify(result.content)).toContain('table')
    })
  })

  describe('表の列幅', () => {
    it('結合を数えて <col> から読んだ列幅を、貼り付けでも残す', () => {
      const element = document.createElement('div')
      element.innerHTML =
        '<table><colgroup><col width="180"/><col width="80"/><col width="140"/></colgroup><tbody>' +
        '<tr><td colspan="2"><p>AB</p></td><td><p>C</p></td></tr>' +
        '<tr><td rowspan="2"><p>A1</p></td><td><p>B1</p></td><td><p>C1</p></td></tr>' +
        '<tr><td><p>B2</p></td><td><p>C2</p></td></tr></tbody></table>'
      const slice = DOMParser.fromSchema(schema).parseSlice(element)

      const result = createPasteFilter(['table'])(slice)
      const colwidths: Record<string, unknown> = {}
      result.content.descendants((node) => {
        if (node.type.name === 'tableCell') colwidths[node.textContent] = node.attrs.colwidth
      })

      expect(colwidths).toEqual({
        AB: [180, 80],
        C: [140],
        A1: [180],
        B1: [80],
        C1: [140],
        B2: [80],
        C2: [140],
      })
    })

    it('colspan より短い列幅は、足りない列を幅未指定の 0 で埋める', () => {
      const element = document.createElement('div')
      element.innerHTML =
        '<table><tbody><tr><td colspan="2" colwidth="200"><p>セル</p></td></tr></tbody></table>'
      const slice = DOMParser.fromSchema(schema).parseSlice(element)

      const result = createPasteFilter(['table'])(slice)
      let colwidth: unknown
      result.content.descendants((node) => {
        if (node.type.name === 'tableCell') colwidth = node.attrs.colwidth
      })

      expect(colwidth).toEqual([200, 0])
    })

    it('colspan より長い列幅は colspan の長さに切る', () => {
      const element = document.createElement('div')
      element.innerHTML =
        '<table><tbody><tr><td colspan="2" colwidth="100,120,140"><p>セル</p></td></tr></tbody></table>'
      const slice = DOMParser.fromSchema(schema).parseSlice(element)

      const result = createPasteFilter(['table'])(slice)
      let colwidth: unknown
      result.content.descendants((node) => {
        if (node.type.name === 'tableCell') colwidth = node.attrs.colwidth
      })

      expect(colwidth).toEqual([100, 120])
    })
  })

  describe('slice の開き具合', () => {
    it('markだけ変えた場合はopenStart/openEndを保つ（インライン貼り付け）', () => {
      const result = filterSlice(['bold'], {
        content: [paragraph([text('斜体', [{ type: 'italic' }])])],
        openStart: 1,
        openEnd: 1,
      })

      expect(result.openStart).toBe(1)
      expect(result.openEnd).toBe(1)
    })

    it('node構造を変えた場合はopenStart/openEndを0にする', () => {
      const result = filterSlice(['bold'], {
        content: [{ type: 'heading', attrs: { level: 2 }, content: [text('見出し')] }],
        openStart: 1,
        openEnd: 1,
      })

      expect(result.openStart).toBe(0)
      expect(result.openEnd).toBe(0)
    })
  })

  describe('属性の値の検証（読み込みと同じ基準）', () => {
    const LINK_FEATURES: readonly RichTextFeature[] = ['link']

    it('リンクの rel と class を、読み込み時と同じ値にそろえる', () => {
      const result = filterSlice(LINK_FEATURES, {
        content: [
          paragraph([
            text('リンク', [
              {
                type: 'link',
                attrs: { href: 'https://example.com', rel: 'opener', class: 'evil big' },
              },
            ]),
          ]),
        ],
      })

      const [link] = JSON.parse(JSON.stringify(result.content))[0].content[0].marks

      expect(link.attrs).toMatchObject({ rel: 'noopener noreferrer nofollow', class: null })
    })

    it.each(['/docs/a', '#sec'])('href %s のリンクは、文字を残してリンクを外す', (href) => {
      const result = filterSlice(LINK_FEATURES, {
        content: [paragraph([text('手順', [{ type: 'link', attrs: { href } }])])],
      })

      expect(JSON.parse(JSON.stringify(result.content))[0].content).toEqual([text('手順')])
    })

    it('許可していない target を落とす', () => {
      const result = filterSlice(LINK_FEATURES, {
        content: [
          paragraph([
            text('リンク', [
              { type: 'link', attrs: { href: 'https://example.com', target: 'evil' } },
            ]),
          ]),
        ],
      })

      expect(JSON.stringify(result.content)).not.toContain('evil')
    })

    it('許可していない色を落とし、属性がすべて空になった textStyle は外す', () => {
      const result = filterSlice(['color', 'backgroundColor'], {
        content: [
          paragraph([
            text('色', [
              {
                type: 'textStyle',
                attrs: { color: 'url(x)', backgroundColor: 'color(srgb 1 0 0)' },
              },
            ]),
          ]),
        ],
      })

      expect(JSON.parse(JSON.stringify(result.content))[0].content).toEqual([text('色')])
    })

    it('表のセルの許可していない色を落とす', () => {
      const result = filterSlice(['table', 'color'], {
        content: [
          {
            type: 'table',
            content: [
              {
                type: 'tableRow',
                content: [
                  {
                    type: 'tableCell',
                    attrs: { color: 'url(x)' },
                    content: [paragraph([text('セル')])],
                  },
                ],
              },
            ],
          },
        ],
      })

      expect(JSON.stringify(result.content)).not.toContain('url(x)')
      expect(JSON.stringify(result.content)).toContain('セル')
    })
  })

  // schemaは全書式を載せているので、フィルタがエディタに配線されていなければ
  // ペーストでfeatures外の書式が入ってしまう
  describe('エディタへの配線', () => {
    it('transformPasted として登録され、features 外の mark を落とす', async () => {
      const { result } = renderHook(() => useRichTextEditor({ features: ['bold'] }))
      await waitFor(() => {
        expect(result.current.editor).not.toBeNull()
      })
      const editor = result.current.editor!

      const transformPasted = editor.view.someProp('transformPasted')
      expect(transformPasted).toBeTypeOf('function')

      const pasted = transformPasted!(
        Slice.fromJSON(editor.schema, {
          content: [paragraph([text('斜体', [{ type: 'italic' }])])],
        }),
        editor.view,
        false,
      )

      expect(JSON.stringify(pasted.content.toJSON())).not.toContain('italic')
      expect(JSON.stringify(pasted.content.toJSON())).toContain('斜体')
    })

    it('HTML を貼り付けると、リンクの rel と class は検証した値で文書に入る', async () => {
      const { result } = renderHook(() => useRichTextEditor({ features: ['link'] }))
      await waitFor(() => {
        expect(result.current.editor).not.toBeNull()
      })
      const editor = result.current.editor!

      // jsdom には ClipboardEvent が無い
      editor.view.pasteHTML(
        '<p><a href="https://example.com" rel="opener" class="evil">リンク</a></p>',
        new Event('paste') as ClipboardEvent,
      )

      const json = JSON.stringify(editor.getJSON())
      expect(json).toContain('noopener noreferrer nofollow')
      expect(json).not.toContain('opener"')
      expect(json).not.toContain('evil')
    })

    it('HTML を貼り付けると、許可していない文字色は文書に入らない', async () => {
      const { result } = renderHook(() =>
        useRichTextEditor({ features: ['color', 'backgroundColor'] }),
      )
      await waitFor(() => {
        expect(result.current.editor).not.toBeNull()
      })
      const editor = result.current.editor!

      // jsdom には ClipboardEvent が無い
      editor.view.pasteHTML(
        '<p><span style="color: color(srgb 1 0 0); background-color: color(srgb 0 1 0)">色</span></p>',
        new Event('paste') as ClipboardEvent,
      )

      const json = JSON.stringify(editor.getJSON())
      expect(json).toContain('色')
      expect(json).not.toContain('textStyle')
    })
  })
})

describe('table cell appearance on paste', () => {
  it.each([
    { features: ['table'] },
    { features: ['table', 'color'] },
    { features: ['table', 'backgroundColor'] },
    { features: ['table', 'color', 'backgroundColor'] },
  ] as const)('respects enabled cell color features: $features', ({ features }) => {
    const cell = schema.nodes.tableCell.create(
      { color: '#0077c7', backgroundColor: '#fde2ea' },
      schema.nodes.paragraph.create(null, schema.text('cell')),
    )
    const table = schema.nodes.table.create(null, schema.nodes.tableRow.create(null, cell))
    const result = createPasteFilter(features)(new Slice(table.content, 0, 0))
    const attrs = result.content.firstChild!.firstChild!.attrs
    expect(attrs.color).toBe(features.some((feature) => feature === 'color') ? '#0077c7' : null)
    expect(attrs.backgroundColor).toBe(
      features.some((feature) => feature === 'backgroundColor') ? '#fde2ea' : null,
    )
    expect(result.content.textBetween(0, result.content.size)).toBe('cell')
  })
})
