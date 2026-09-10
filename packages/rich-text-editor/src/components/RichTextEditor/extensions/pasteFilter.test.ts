import { renderHook, waitFor } from '@testing-library/react'
import { Editor } from '@tiptap/core'
import { Slice } from '@tiptap/pm/model'
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
      expect(json).toContain('20px')
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
  })
})
