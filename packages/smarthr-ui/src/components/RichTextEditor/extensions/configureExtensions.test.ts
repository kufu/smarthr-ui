import { Editor } from '@tiptap/core'
import { describe, expect, it } from 'vitest'

import { configureExtensions } from './configureExtensions'

import type { RichTextFeature } from '../types'
import type { AnyExtension } from '@tiptap/core'

const createEditor = (features: readonly RichTextFeature[], content?: unknown) => {
  const element = document.createElement('div')
  document.body.appendChild(element)

  return new Editor({
    element,
    extensions: configureExtensions({ features }) as AnyExtension[],
    content: content as never,
  })
}

/** Mod-<key> を押す。jsdomでは ctrlKey で Mod として解釈される */
const pressMod = (editor: Editor, key: string) => {
  editor.commands.selectAll()
  editor.view.dom.dispatchEvent(
    new KeyboardEvent('keydown', { key, ctrlKey: true, bubbles: true, cancelable: true }),
  )
}

const RICH_CONTENT = {
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '見出し' }] },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: '太字', marks: [{ type: 'bold' }] },
        { type: 'text', text: '斜体', marks: [{ type: 'italic' }] },
        { type: 'text', text: '赤字', marks: [{ type: 'textStyle', attrs: { color: '#ff0000' } }] },
      ],
    },
    { type: 'paragraph', content: [{ type: 'text', text: '無関係な段落' }] },
  ],
}

const TABLE_CONTENT = {
  type: 'doc',
  content: [
    {
      type: 'table',
      content: [
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableHeader',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: '見出しセル' }] }],
            },
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

describe('configureExtensions', () => {
  // features は「新しく適用できる操作」の制限であり、入力できる書式の制限ではない。
  // 既存データに features 外の書式が含まれていても失われてはならない。
  describe('features 外の書式を含む入力', () => {
    it('features 外の mark / node / 属性を含む入力を保持する', () => {
      const editor = createEditor(['bold'], RICH_CONTENT)
      const json = JSON.stringify(editor.getJSON())

      expect(json).toContain('italic')
      expect(json).toContain('heading')
      expect(json).toContain('#ff0000')
      expect(json).toContain('無関係な段落')
      editor.destroy()
    })

    it('features 外の table を含む入力を保持し描画できる', () => {
      const editor = createEditor(['bold'], TABLE_CONTENT)
      const html = editor.getHTML()

      expect(html).toContain('<table')
      expect(html).toContain('見出しセル')
      expect(editor.view.dom.querySelectorAll('td')).toHaveLength(1)
      expect(editor.view.dom.querySelectorAll('th')).toHaveLength(1)
      editor.destroy()
    })

    it('features に含まれる書式だけの入力も当然保持する', () => {
      const editor = createEditor(['bold'], {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: '太字', marks: [{ type: 'bold' }] }],
          },
        ],
      })

      expect(JSON.stringify(editor.getJSON())).toContain('bold')
      editor.destroy()
    })
  })

  describe('features 外の操作は無効', () => {
    it('features 外のショートカットは効かず、features 内のショートカットは効く', () => {
      const editor = createEditor(['bold'], {
        type: 'doc',
        content: [{ type: 'paragraph', content: [{ type: 'text', text: 'hello' }] }],
      })

      pressMod(editor, 'i')
      expect(JSON.stringify(editor.getJSON())).not.toContain('italic')

      pressMod(editor, 'b')
      expect(JSON.stringify(editor.getJSON())).toContain('bold')
      editor.destroy()
    })

    it('features 外の入力ルールは登録されない', () => {
      const editor = createEditor(['bold'])
      const heading = editor.extensionManager.extensions.find((e) => e.name === 'heading')!
      const bold = editor.extensionManager.extensions.find((e) => e.name === 'bold')!

      expect((heading.config.addInputRules as () => unknown[])()).toHaveLength(0)
      expect((bold.config.addInputRules as () => unknown[])().length).toBeGreaterThan(0)
      editor.destroy()
    })

    // autolink は入力ルールではなく appendTransaction を持つ ProseMirror プラグインなので、
    // addProseMirrorPlugins を剥がさないと features に link が無くてもリンクが付く。
    it('features に link が無いときURL入力でリンクが付かない', () => {
      const editor = createEditor(['bold'], {
        type: 'doc',
        content: [{ type: 'paragraph', content: [{ type: 'text', text: 'https://example.com' }] }],
      })

      editor.commands.insertContentAt(editor.state.doc.content.size - 1, ' ')

      expect(JSON.stringify(editor.getJSON())).not.toContain('"link"')
      editor.destroy()
    })

    it('features に link があるときはURL入力でリンクが付く', () => {
      const editor = createEditor(['link'], {
        type: 'doc',
        content: [{ type: 'paragraph', content: [{ type: 'text', text: 'https://example.com' }] }],
      })

      editor.commands.insertContentAt(editor.state.doc.content.size - 1, ' ')

      expect(JSON.stringify(editor.getJSON())).toContain('"link"')
      editor.destroy()
    })
  })

  describe('extension のオプション', () => {
    const createWithHeadingLevels = (
      features: readonly RichTextFeature[],
      headingLevels: ReadonlyArray<1 | 2 | 3 | 4>,
    ) => {
      const element = document.createElement('div')
      document.body.appendChild(element)

      return new Editor({
        element,
        extensions: configureExtensions({ features, headingLevels }) as AnyExtension[],
      })
    }

    it('features に heading があるとき headingLevels が適用される', () => {
      const editor = createWithHeadingLevels(['heading'], [1, 2])
      const heading = editor.extensionManager.extensions.find((e) => e.name === 'heading')!

      expect(heading.options.levels).toEqual([1, 2])
      editor.destroy()
    })

    // headingLevels は「適用できるレベル」の指定なので、heading自体が使えないなら
    // schemaは既存の見出しを読めるよう全レベルを受け入れる
    it('features に heading が無いとき schema は全レベルを受け入れる', () => {
      const editor = createWithHeadingLevels(['bold'], [1, 2])
      const heading = editor.extensionManager.extensions.find((e) => e.name === 'heading')!

      expect(heading.options.levels).toEqual([1, 2, 3, 4])
      editor.destroy()
    })

    it('link の設定が保持される', () => {
      const editor = createWithHeadingLevels(['bold'], [1, 2])
      const link = editor.extensionManager.extensions.find((e) => e.name === 'link')!

      expect(link.options.openOnClick).toBe(false)
      expect(link.options.protocols).toEqual(['http', 'https', 'mailto'])
      editor.destroy()
    })
  })
})
