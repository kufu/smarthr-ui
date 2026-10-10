import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Editor } from '@tiptap/core'
import { IntlProvider } from 'smarthr-ui'
import { describe, expect, it, onTestFinished, vi } from 'vitest'

import { RichTextEditor } from '../../RichTextEditor/RichTextEditor'
import { ALL_FEATURES, configureExtensions } from '../configureExtensions'

import { YoutubeFloatingUI } from './YoutubeFloatingUI'

import type { ReactNode } from 'react'

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">{children}</IntlProvider>
)

const youtubeDoc = {
  type: 'doc',
  content: [
    { type: 'paragraph' },
    { type: 'youtube', attrs: { src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' } },
  ],
}

describe('YoutubeFloatingUI', () => {
  it('YouTube 未選択では操作バーを出さない', async () => {
    render(<RichTextEditor defaultValue={youtubeDoc} features={['youtube']} />, {
      wrapper: Wrapper,
    })
    await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())
    expect(screen.queryByRole('toolbar', { name: 'YouTube動画の操作' })).not.toBeInTheDocument()
  })

  it('選択中は出て、配置と削除が効く', async () => {
    const user = userEvent.setup()
    const editor = new Editor({
      extensions: configureExtensions({ features: ALL_FEATURES }),
      content: youtubeDoc,
    })
    const container = document.createElement('div')
    document.body.append(container)
    onTestFinished(() => {
      editor.destroy()
      container.remove()
    })
    editor.commands.setNodeSelection(2)

    render(<YoutubeFloatingUI containerRef={{ current: container }} editor={editor as never} />, {
      wrapper: Wrapper,
    })

    expect(await screen.findByRole('toolbar', { name: 'YouTube動画の操作' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'サイズ' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '配置: 左揃え' }))
    await user.click(screen.getByRole('option', { name: '右揃え' }))
    expect(editor.$node('youtube')?.attributes.align).toBe('right')

    await user.click(screen.getByRole('button', { name: 'YouTube動画を削除' }))
    expect(editor.$node('youtube')).toBeNull()
    expect(screen.queryByRole('toolbar', { name: 'YouTube動画の操作' })).not.toBeInTheDocument()
  })

  it('YouTube を選んで Alt+Enter を押すと、操作バーの先頭のボタンへ移る', async () => {
    const editor = new Editor({
      extensions: configureExtensions({ features: ALL_FEATURES }),
      content: youtubeDoc,
    })
    const container = document.createElement('div')
    document.body.append(container)
    onTestFinished(() => {
      editor.destroy()
      container.remove()
    })
    editor.commands.setNodeSelection(2)

    render(<YoutubeFloatingUI containerRef={{ current: container }} editor={editor as never} />, {
      wrapper: Wrapper,
    })
    await screen.findByRole('toolbar', { name: 'YouTube動画の操作' })

    act(() => {
      editor.commands.keyboardShortcut('Alt-Enter')
    })

    expect(screen.getByRole('button', { name: '配置: 左揃え' })).toHaveFocus()
  })

  it('編集中は動画プレーヤーを Tab の対象から外し、読み取り専用では戻す', () => {
    const editor = new Editor({
      extensions: configureExtensions({ features: ALL_FEATURES }),
      content: youtubeDoc,
    })
    onTestFinished(() => editor.destroy())
    const iframe = () => editor.view.dom.querySelector('iframe')!

    expect(iframe().getAttribute('tabindex')).toBe('-1')

    editor.setEditable(false)
    expect(iframe().hasAttribute('tabindex')).toBe(false)

    editor.setEditable(true)
    expect(iframe().getAttribute('tabindex')).toBe('-1')
  })

  it('配置を変えても、動画の要素の大きさを見張り続ける', async () => {
    const observed = new Set<Element>()
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe(el: Element) {
          observed.add(el)
        }
        unobserve(el: Element) {
          observed.delete(el)
        }
        disconnect() {
          observed.clear()
        }
      },
    )
    onTestFinished(() => {
      vi.unstubAllGlobals()
    })

    const editor = new Editor({
      extensions: configureExtensions({ features: ALL_FEATURES }),
      content: youtubeDoc,
    })
    const container = document.createElement('div')
    document.body.append(container)
    onTestFinished(() => {
      editor.destroy()
      container.remove()
    })
    editor.commands.setNodeSelection(2)

    render(<YoutubeFloatingUI containerRef={{ current: container }} editor={editor as never} />, {
      wrapper: Wrapper,
    })
    await screen.findByRole('toolbar', { name: 'YouTube動画の操作' })

    const before = editor.view.nodeDOM(2)
    act(() => {
      editor.chain().setNodeSelection(2).updateAttributes('youtube', { align: 'right' }).run()
    })
    const after = editor.view.nodeDOM(2) as Element

    expect(after).toBe(before)
    await waitFor(() => expect(observed.has(after)).toBe(true))
  })

  it('キーボードで動画を削除すると、本文へフォーカスが戻る', async () => {
    const user = userEvent.setup()
    const element = document.createElement('div')
    document.body.append(element)
    const editor = new Editor({
      element,
      extensions: configureExtensions({ features: ALL_FEATURES }),
      content: youtubeDoc,
    })
    const container = document.createElement('div')
    document.body.append(container)
    onTestFinished(() => {
      editor.destroy()
      element.remove()
      container.remove()
    })
    editor.commands.setNodeSelection(2)

    render(<YoutubeFloatingUI containerRef={{ current: container }} editor={editor as never} />, {
      wrapper: Wrapper,
    })
    screen.getByRole('button', { name: 'YouTube動画を削除' }).focus()
    await user.keyboard('{Enter}')

    expect(editor.$node('youtube')).toBeNull()
    await waitFor(() => expect(editor.view.dom).toHaveFocus())
  })
})
