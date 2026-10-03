import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Editor } from '@tiptap/core'
import { IntlProvider } from 'smarthr-ui'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'

import { ALL_FEATURES, configureExtensions } from '../configureExtensions'

import { ImageAltPopover } from './ImageAltPopover'

import type { ReactNode } from 'react'

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

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">{children}</IntlProvider>
)

const editors: Editor[] = []
afterEach(() => {
  while (editors.length > 0) editors.pop()?.destroy()
})

describe('ImageAltPopover', () => {
  it('開いている間に画像の位置が動いても、入力中の値を保ったまま動いた先の画像へ適用する', async () => {
    const user = userEvent.setup()
    const editor = new Editor({
      extensions: configureExtensions({ features: ALL_FEATURES }),
      content: {
        type: 'doc',
        content: [
          { type: 'paragraph' },
          { type: 'image', attrs: { src: 'https://example.com/a.png', alt: '元' } },
        ],
      },
    })
    editors.push(editor)
    editor.commands.setNodeSelection(2)

    const { rerender } = render(<ImageAltPopover editor={editor as never} pos={2} />, {
      wrapper: Wrapper,
    })
    await user.click(screen.getByRole('button', { name: '代替テキスト（alt）' }))
    const input = screen.getByRole('textbox', { name: /^代替テキスト/ })
    await user.type(input, 'の説明')

    act(() => {
      editor.commands.insertContentAt(1, '前', { updateSelection: false })
    })
    rerender(<ImageAltPopover editor={editor as never} pos={3} />)

    expect(input).toHaveValue('元の説明')

    await user.click(screen.getByRole('button', { name: '適用' }))

    expect(editor.state.doc.nodeAt(3)?.attrs.alt).toBe('元の説明')
  })

  it('開いている間に選択が別の画像へ移ったら、どちらの画像にも書き込まずに閉じてトリガーへ戻る', async () => {
    const user = userEvent.setup()
    const editor = new Editor({
      extensions: configureExtensions({ features: ALL_FEATURES }),
      content: {
        type: 'doc',
        content: [
          { type: 'image', attrs: { src: 'https://example.com/a.png', alt: 'A' } },
          { type: 'image', attrs: { src: 'https://example.com/b.png', alt: 'B' } },
        ],
      },
    })
    editors.push(editor)
    editor.commands.setNodeSelection(0)

    const { rerender } = render(<ImageAltPopover editor={editor as never} pos={0} />, {
      wrapper: Wrapper,
    })
    const trigger = screen.getByRole('button', { name: '代替テキスト（alt）' })
    await user.click(trigger)
    await user.type(screen.getByRole('textbox', { name: /^代替テキスト/ }), 'の説明')

    act(() => {
      editor.commands.setNodeSelection(1)
    })
    rerender(<ImageAltPopover editor={editor as never} pos={1} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
    expect(editor.state.doc.nodeAt(0)?.attrs.alt).toBe('A')
    expect(editor.state.doc.nodeAt(1)?.attrs.alt).toBe('B')
  })

  it('適用して閉じるとトリガーへフォーカスが戻る', async () => {
    const user = userEvent.setup()
    const editor = new Editor({
      extensions: configureExtensions({ features: ALL_FEATURES }),
      content: {
        type: 'doc',
        content: [{ type: 'image', attrs: { src: 'https://example.com/a.png', alt: '' } }],
      },
    })
    editors.push(editor)
    editor.commands.setNodeSelection(0)

    render(<ImageAltPopover editor={editor as never} pos={0} />, { wrapper: Wrapper })
    const trigger = screen.getByRole('button', { name: '代替テキスト（alt）' })
    await user.click(trigger)
    await user.type(screen.getByRole('textbox', { name: /^代替テキスト/ }), '説明{Enter}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
    expect(editor.state.doc.nodeAt(0)?.attrs.alt).toBe('説明')
  })

  it('開いている間に画像が削除されて後ろの画像が詰まってきたら、そちらに書き込まずに閉じる', async () => {
    const user = userEvent.setup()
    const editor = new Editor({
      extensions: configureExtensions({ features: ALL_FEATURES }),
      content: {
        type: 'doc',
        content: [
          { type: 'paragraph' },
          { type: 'image', attrs: { src: 'https://example.com/a.png', alt: 'A' } },
          { type: 'image', attrs: { src: 'https://example.com/b.png', alt: 'B' } },
        ],
      },
    })
    editors.push(editor)
    editor.commands.setNodeSelection(2)

    const { rerender } = render(<ImageAltPopover editor={editor as never} pos={2} />, {
      wrapper: Wrapper,
    })
    await user.click(screen.getByRole('button', { name: '代替テキスト（alt）' }))
    await user.type(screen.getByRole('textbox', { name: /^代替テキスト/ }), 'の説明')

    act(() => {
      editor.chain().deleteRange({ from: 0, to: 3 }).setNodeSelection(0).run()
    })
    rerender(<ImageAltPopover editor={editor as never} pos={0} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(editor.state.doc.nodeAt(0)?.attrs.alt).toBe('B')
  })
})
