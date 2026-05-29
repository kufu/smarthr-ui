import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { RichTextViewer } from './RichTextViewer'

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
})
