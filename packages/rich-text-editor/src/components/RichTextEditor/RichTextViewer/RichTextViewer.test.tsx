import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { getRichTextSchema } from '../serializers/richTextSchema'
import { serializeToHTML } from '../serializers/serializeToHTML'
import { serializeToReactElement } from '../serializers/serializeToReactElement'

import { RichTextViewer } from './RichTextViewer'

import type { RichTextJSON, RichTextViewerProps } from '../types'
import type { JSONContent } from '@tiptap/core'

vi.mock('../serializers/serializeToReactElement', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>

  return {
    ...actual,
    serializeToReactElement: vi.fn(
      actual.serializeToReactElement as typeof serializeToReactElement,
    ),
  }
})

// style は属性の文字列のまま比べない。生の属性は経路によって色の書式（#ff0000 と rgb()）や宣言の順が違うため、
// CSSOM で読んだプロパティごとの値で比べる
const attributesOf = (el: Element): Record<string, string> =>
  Object.fromEntries(
    Array.from(el.attributes, ({ name, value }) => [
      name,
      name === 'style' && el instanceof HTMLElement
        ? Array.from(el.style)
            .sort()
            .map((property) => `${property}: ${el.style.getPropertyValue(property)}`)
            .join('; ')
        : value,
    ]),
  )

describe('RichTextViewer', () => {
  it('HTML content を正規化して描画する', () => {
    render(<RichTextViewer content={{ format: 'html', content: '<p>HTMLから表示</p>' }} />)
    expect(screen.getByText('HTMLから表示')).toBeInTheDocument()
  })

  it('太字マークを strong タグで描画する', () => {
    render(
      <RichTextViewer
        content={{
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', marks: [{ type: 'bold' }], text: '太字' }],
            },
          ],
        }}
      />,
    )
    const strong = screen.getByText('太字')
    expect(strong.tagName).toBe('STRONG')
  })

  describe('マークの入れ子の順と属性を、HTML 出力（エディタの描画）とそろえる', () => {
    const TEXT = '重ねた装飾'
    const docWithMarks = (marks: NonNullable<RichTextJSON['marks']>): RichTextJSON => ({
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: TEXT, marks }] }],
    })
    const marksAround = (root: ParentNode) => {
      const marks: Array<{ tag: string; attributes: Record<string, string> }> = []
      const innermost = Array.from(root.querySelectorAll<HTMLElement>('*')).find(
        (el) => el.children.length === 0 && el.textContent === TEXT,
      )
      for (let el = innermost; el && el.tagName !== 'P'; el = el.parentElement ?? undefined) {
        marks.unshift({ tag: el.tagName, attributes: attributesOf(el) })
      }
      return marks
    }
    const expectSameMarks = (content: RichTextJSON, depth: number) => {
      const expected = marksAround(
        new DOMParser().parseFromString(serializeToHTML(content), 'text/html').body,
      )

      const { container } = render(<RichTextViewer content={content} />)

      expect(expected).toHaveLength(depth)
      expect(marksAround(container)).toEqual(expected)
    }
    const TEXT_STYLE = {
      type: 'textStyle',
      attrs: { fontSize: '3.75rem', color: '#ff0000', backgroundColor: '#00ff00' },
    }

    it('重なったマークを同じ順・同じ属性で描画する', () => {
      expectSameMarks(
        docWithMarks([
          { type: 'underline' },
          { type: 'strike' },
          { type: 'italic' },
          { type: 'bold' },
          { type: 'link', attrs: { href: 'https://example.com', target: '_self' } },
          TEXT_STYLE,
        ]),
        6,
      )
    })

    it.each(Object.keys(getRichTextSchema().marks).filter((name) => name !== TEXT_STYLE.type))(
      'スキーマの %s と文字スタイルを重ねても同じ順・同じ属性で描画する',
      (name) => {
        const mark =
          name === 'link' ? { type: name, attrs: { href: 'https://example.com' } } : { type: name }

        expectSameMarks(docWithMarks([mark, TEXT_STYLE]), 2)
      },
    )
  })

  it('すべての要素を、HTML 出力と同じ構造・同じ属性で描画する', () => {
    const text = (value: string, marks?: JSONContent['marks']): JSONContent => ({
      type: 'text',
      text: value,
      marks,
    })
    const paragraph = (value: string, attrs?: Record<string, unknown>): JSONContent => ({
      type: 'paragraph',
      attrs,
      content: [text(value)],
    })
    const content: RichTextJSON = {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2, textAlign: 'center', lineHeight: '1.5' },
          content: [text('見出し')],
        },
        paragraph('行間と配置', { textAlign: 'center', lineHeight: '2' }),
        {
          type: 'paragraph',
          content: [
            text('リンク', [
              {
                type: 'link',
                attrs: { href: 'https://example.com', target: '_self', title: 'リンクの説明' },
              },
            ]),
            { type: 'hardBreak' },
            text('改行の後'),
          ],
        },
        { type: 'bulletList', content: [{ type: 'listItem', content: [paragraph('点')] }] },
        {
          type: 'orderedList',
          attrs: { start: 3 },
          content: [{ type: 'listItem', content: [paragraph('番号')] }],
        },
        { type: 'blockquote', content: [paragraph('引用')] },
        { type: 'codeBlock', attrs: { language: 'ts' }, content: [text('const a = 1')] },
        { type: 'horizontalRule' },
        {
          type: 'paragraph',
          content: [
            {
              type: 'image',
              attrs: {
                src: '/a.png',
                alt: '代替',
                title: '画像の説明',
                width: 200,
                height: 100,
                align: 'center',
              },
            },
          ],
        },
        {
          type: 'youtube',
          attrs: {
            src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            width: 320,
            height: 180,
            start: 10,
            align: 'right',
          },
        },
        {
          type: 'table',
          content: [
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableHeader',
                  attrs: { colwidth: [120], backgroundColor: '#ff0000' },
                  content: [paragraph('見出しセル')],
                },
                { type: 'tableHeader', attrs: { colspan: 2 }, content: [paragraph('結合')] },
              ],
            },
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  attrs: { colwidth: [120], color: '#00ff00' },
                  content: [paragraph('A')],
                },
                { type: 'tableCell', content: [paragraph('B')] },
                { type: 'tableCell', content: [paragraph('C')] },
              ],
            },
          ],
        },
      ],
    }
    type Tree =
      { tag: string; attributes: Record<string, string>; children: Tree[] } | { text: string }
    const toTree = (node: Node): Tree =>
      node instanceof Element
        ? {
            tag: node.tagName,
            attributes: attributesOf(node),
            children: Array.from(node.childNodes, toTree),
          }
        : { text: node.textContent ?? '' }
    // 意図して違うところをそろえる
    // - 幅を指定した画像がはみ出さないよう、Viewer だけ max-width と height を付ける
    // - HTML 出力の iframe には、Tiptap が URL のクエリ用の設定値を属性としても並べる。ブラウザは無視するため Viewer は出さない
    const IMAGE_FIT_DECLARATIONS = ['max-width: 100%', 'height: auto']
    const YOUTUBE_OPTION_ATTRIBUTES = [
      'autoplay',
      'disablekbcontrols',
      'enableiframeapi',
      'endtime',
      'ivloadpolicy',
      'loop',
      'modestbranding',
      'origin',
      'playlist',
      'rel',
      'start',
    ]
    const alignIntendedDifferences = (expected: Tree, actual: Tree | undefined): void => {
      if (!actual || !('tag' in expected) || !('tag' in actual)) return
      if (actual.tag === 'IMG' && actual.attributes.style) {
        actual.attributes.style = actual.attributes.style
          .split('; ')
          .filter((declaration) => !IMAGE_FIT_DECLARATIONS.includes(declaration))
          .join('; ')
      }
      if (expected.tag === 'IFRAME') {
        YOUTUBE_OPTION_ATTRIBUTES.forEach((name) => delete expected.attributes[name])
        // 真偽の属性なので、値（"true" と ""）ではなく付いているかだけを比べる
        if ('allowfullscreen' in expected.attributes && 'allowfullscreen' in actual.attributes) {
          expected.attributes.allowfullscreen = actual.attributes.allowfullscreen
        }
      }
      expected.children.forEach((child, i) => alignIntendedDifferences(child, actual.children[i]))
    }
    const nodeTypesIn = (node: JSONContent): string[] => [
      node.type ?? '',
      ...(node.content ?? []).flatMap(nodeTypesIn),
    ]

    expect(
      Object.keys(getRichTextSchema().nodes).filter((name) => !nodeTypesIn(content).includes(name)),
    ).toEqual([])

    const expected = Array.from(
      new DOMParser().parseFromString(serializeToHTML(content), 'text/html').body.childNodes,
      toTree,
    )
    const { container } = render(<RichTextViewer content={content} />)
    const actual = Array.from(container.firstElementChild!.childNodes, toTree)
    expected.forEach((tree, i) => alignIntendedDifferences(tree, actual[i]))

    expect(actual).toEqual(expected)
  })

  it('中身の同じ HTML を包み直して渡し直しても、描画し直さない', () => {
    vi.mocked(serializeToReactElement).mockClear()
    const { rerender } = render(
      <RichTextViewer content={{ format: 'html', content: '<p>同じ</p>' }} />,
    )

    rerender(<RichTextViewer content={{ format: 'html', content: '<p>同じ</p>' }} />)

    expect(serializeToReactElement).toHaveBeenCalledTimes(1)
  })

  it('見出しを h タグで描画する', () => {
    const { container } = render(
      <RichTextViewer
        content={{
          type: 'doc',
          content: [
            {
              type: 'heading',
              attrs: { level: 2 },
              content: [{ type: 'text', text: '見出し' }],
            },
          ],
        }}
      />,
    )
    expect(container.querySelector('h2')).toHaveTextContent('見出し')
  })

  it('リンクを a タグで描画する', () => {
    render(
      <RichTextViewer
        content={{
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  marks: [{ type: 'link', attrs: { href: 'https://example.com' } }],
                  text: 'リンク',
                },
              ],
            },
          ],
        }}
      />,
    )
    const link = screen.getByText('リンク')
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', 'https://example.com')
  })

  it('水平線を hr タグで描画する', () => {
    const { container } = render(
      <RichTextViewer
        content={{
          type: 'doc',
          content: [{ type: 'horizontalRule' }],
        }}
      />,
    )
    expect(container.querySelector('hr')).toBeInTheDocument()
  })

  it('コードブロックを pre > code で描画する', () => {
    const { container } = render(
      <RichTextViewer
        content={{
          type: 'doc',
          content: [{ type: 'codeBlock', content: [{ type: 'text', text: 'const x = 1' }] }],
        }}
      />,
    )
    expect(container.querySelector('pre code')).toHaveTextContent('const x = 1')
  })

  it('gap 未指定時はデフォルトで shr-rte-space-y-1 クラスが付く', () => {
    const { container } = render(<RichTextViewer content={{ format: 'empty' }} />)
    expect(container.querySelector('.smarthr-ui-RichTextViewer')).toHaveClass('shr-rte-space-y-1')
  })

  it('gap 指定時に対応する shr-rte-space-y クラスが付く', () => {
    const { container } = render(<RichTextViewer content={{ format: 'empty' }} gap={2} />)
    expect(container.querySelector('.smarthr-ui-RichTextViewer')).toHaveClass('shr-rte-space-y-2')
  })

  it('直下要素の縦マージンをリセットするクラスが付く', () => {
    const { container } = render(<RichTextViewer content={{ format: 'empty' }} />)
    expect(container.querySelector('.smarthr-ui-RichTextViewer')).toHaveClass('[&>*]:shr-rte-my-0')
  })

  describe('壊れた JSON でも例外を投げず、正常な部分を描画する', () => {
    const paragraph = (text: string) => ({
      type: 'paragraph',
      content: [{ type: 'text', text }],
    })

    const renderBroken = (content: unknown) =>
      render(<RichTextViewer content={content as RichTextViewerProps['content']} />)

    const textOf = (container: HTMLElement) =>
      container.querySelector('.smarthr-ui-RichTextViewer')?.textContent

    it('未知の node は中身だけを描画する', () => {
      const { container } = renderBroken({
        type: 'doc',
        content: [
          paragraph('前'),
          { type: 'mermaid', content: [{ type: 'text', text: '中' }] },
          paragraph('後'),
        ],
      })
      expect(textOf(container)).toBe('前中後')
    })

    it('未知の mark は装飾を外して文字を描画する', () => {
      const { container } = renderBroken({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: '印', marks: [{ type: 'highlight' }] }],
          },
        ],
      })
      expect(textOf(container)).toBe('印')
    })

    it('配列でない marks は無視する', () => {
      const { container } = renderBroken({
        type: 'doc',
        content: [
          { type: 'paragraph', content: [{ type: 'text', text: 'x', marks: { type: 'bold' } }] },
        ],
      })
      expect(textOf(container)).toBe('x')
    })

    it('配列でない content は無視する', () => {
      const { container } = renderBroken({ type: 'doc', content: 'abc' })
      expect(textOf(container)).toBe('')
    })

    it('null の要素は取り除く', () => {
      const { container } = renderBroken({
        type: 'doc',
        content: [paragraph('前'), null, paragraph('後')],
      })
      expect(textOf(container)).toBe('前後')
    })

    it('文字列を持たない text ノードは取り除く', () => {
      const { container } = renderBroken({
        type: 'doc',
        content: [paragraph('前'), { type: 'paragraph', content: [{ type: 'text' }] }],
      })
      expect(textOf(container)).toBe('前')
    })

    it.each([
      ['content が null', null],
      ['format が無いオブジェクト', {}],
      ['format: json の中身が null', { format: 'json', content: null }],
    ])('%s なら空で描画する', (_, content) => {
      const { container } = renderBroken(content)
      expect(textOf(container)).toBe('')
    })
  })

  it('描画に失敗しても例外を投げず、その Viewer だけを空にしてエラーを出力する', () => {
    const error = new Error('broken')
    vi.mocked(serializeToReactElement).mockImplementationOnce(() => {
      throw error
    })
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <>
        <p>ページの他の部分</p>
        <RichTextViewer content={{ format: 'html', content: '<p>本文</p>' }} />
      </>,
    )

    expect(screen.getByText('ページの他の部分')).toBeInTheDocument()
    expect(screen.queryByText('本文')).not.toBeInTheDocument()
    expect(spy).toHaveBeenCalledWith(error)
    spy.mockRestore()
  })
})
