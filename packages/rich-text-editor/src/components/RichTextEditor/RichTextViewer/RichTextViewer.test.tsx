import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { serializeToReactElement } from '../serializers/serializeToReactElement'

import { RichTextViewer } from './RichTextViewer'

import type { RichTextViewerProps } from '../types'

vi.mock('../serializers/serializeToReactElement', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>

  return {
    ...actual,
    serializeToReactElement: vi.fn(
      actual.serializeToReactElement as typeof serializeToReactElement,
    ),
  }
})

describe('RichTextViewer', () => {
  it('JSON content を静的に描画する', () => {
    render(
      <RichTextViewer
        content={{
          type: 'doc',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '表示テスト' }] }],
        }}
      />,
    )
    expect(screen.getByText('表示テスト')).toBeInTheDocument()
  })

  it('HTML content を正規化して描画する', () => {
    render(<RichTextViewer content={{ format: 'html', content: '<p>HTMLから表示</p>' }} />)
    expect(screen.getByText('HTMLから表示')).toBeInTheDocument()
  })

  it('empty content で空の div を描画する', () => {
    const { container } = render(<RichTextViewer content={{ format: 'empty' }} />)
    expect(container.querySelector('.smarthr-ui-RichTextViewer')).toBeInTheDocument()
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

  it('gap 未指定時はデフォルトで shr-space-y-1 クラスが付く', () => {
    const { container } = render(<RichTextViewer content={{ format: 'empty' }} />)
    expect(container.querySelector('.smarthr-ui-RichTextViewer')).toHaveClass('shr-space-y-1')
  })

  it('gap 指定時に対応する shr-space-y クラスが付く', () => {
    const { container } = render(<RichTextViewer content={{ format: 'empty' }} gap={2} />)
    expect(container.querySelector('.smarthr-ui-RichTextViewer')).toHaveClass('shr-space-y-2')
  })

  it('直下要素の縦マージンをリセットするクラスが付く', () => {
    const { container } = render(<RichTextViewer content={{ format: 'empty' }} />)
    expect(container.querySelector('.smarthr-ui-RichTextViewer')).toHaveClass('[&>*]:shr-my-0')
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
