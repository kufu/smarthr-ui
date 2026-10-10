import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Editor } from '@tiptap/core'
import { createRef } from 'react'
import { IntlProvider } from 'smarthr-ui'
import { afterEach, beforeAll, describe, expect, it, onTestFinished, vi } from 'vitest'

import { RichTextEditor } from '../../RichTextEditor/RichTextEditor'
import { ALL_FEATURES, configureExtensions } from '../configureExtensions'

import { ImageFloatingUI } from './ImageFloatingUI'

import type { ReactNode } from 'react'

// jsdom には ResizeObserver が無く、挿入された画像の NodeView がマウント時に参照するため、
// 最小限のスタブを用意する。
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

const imageDoc = {
  type: 'doc',
  content: [
    { type: 'paragraph' },
    { type: 'image', attrs: { src: 'https://example.com/a.png', alt: '' } },
  ],
}

describe('ImageFloatingUI', () => {
  it('画像未選択ではツールバー(画像の操作)は出ない', async () => {
    render(<RichTextEditor defaultValue={imageDoc} features={['image']} />, { wrapper: Wrapper })
    await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())
    expect(screen.queryByRole('toolbar', { name: '画像の操作' })).not.toBeInTheDocument()
  })

  it('readOnly では画像選択UIが出ない', async () => {
    render(<RichTextEditor readOnly defaultValue={imageDoc} features={['image']} />, {
      wrapper: Wrapper,
    })
    await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())
    expect(screen.queryByRole('toolbar', { name: '画像の操作' })).not.toBeInTheDocument()
  })

  describe('配置', () => {
    const editors: Editor[] = []
    const containers: HTMLElement[] = []
    afterEach(() => {
      while (editors.length > 0) editors.pop()?.destroy()
      while (containers.length > 0) containers.pop()?.remove()
      vi.restoreAllMocks()
    })

    const mockRect = (el: Element, left: number, top: number, width = 0, height = 0) =>
      vi.spyOn(el, 'getBoundingClientRect').mockReturnValue(new DOMRect(left, top, width, height))

    it('コンテナのボーダーの内側を原点として、画像の左上の上に置く', async () => {
      const editor = new Editor({
        extensions: configureExtensions({ features: ALL_FEATURES }),
        content: imageDoc,
      })
      editors.push(editor)

      const container = document.createElement('div')
      document.body.append(container)
      containers.push(container)
      vi.spyOn(container, 'clientLeft', 'get').mockReturnValue(3)
      vi.spyOn(container, 'clientTop', 'get').mockReturnValue(2)
      mockRect(container, 100, 50)
      mockRect(editor.view.dom, 103, 52, 600, 400)
      const img = editor.view.dom.querySelector('img')!
      mockRect(img, 130, 200, 300, 200)
      editor.commands.setNodeSelection(2)

      const containerRef = createRef<HTMLElement>()
      containerRef.current = container
      render(<ImageFloatingUI containerRef={containerRef} editor={editor as never} />, {
        wrapper: Wrapper,
      })

      const bar = await screen.findByRole('toolbar', { name: '画像の操作' })
      // 画像の上端 200 から、バーの高さ36と間隔6を引いた位置
      expect(bar).toHaveStyle({ left: '27px', top: '106px' })
    })

    it('右に寄せた画像でも、バーを編集領域の右端からはみ出させない', async () => {
      const editor = new Editor({
        extensions: configureExtensions({ features: ALL_FEATURES }),
        content: imageDoc,
      })
      editors.push(editor)

      const container = document.createElement('div')
      document.body.append(container)
      containers.push(container)
      mockRect(container, 100, 50)
      mockRect(editor.view.dom, 100, 50, 600, 400)
      mockRect(editor.view.dom.querySelector('img')!, 600, 200, 100, 100)
      // jsdom は描画しないので、バーの幅を与える
      vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(300)
      editor.commands.setNodeSelection(2)

      const containerRef = createRef<HTMLElement>()
      containerRef.current = container
      render(<ImageFloatingUI containerRef={containerRef} editor={editor as never} />, {
        wrapper: Wrapper,
      })

      const bar = await screen.findByRole('toolbar', { name: '画像の操作' })
      // 画像の左端 500 からだと 800 まで伸びるので、編集領域の右端 600 に収まる 300 へ寄せる
      await waitFor(() => expect(bar).toHaveStyle({ left: '300px' }))
    })
  })

  it('ポップオーバーを開いている間に画像の位置が動いても、閉じずに入力中の値を保つ', async () => {
    const user = userEvent.setup()
    const editor = new Editor({
      extensions: configureExtensions({ features: ALL_FEATURES }),
      content: imageDoc,
    })
    const container = document.createElement('div')
    document.body.append(container)
    editor.commands.setNodeSelection(2)

    const containerRef = createRef<HTMLElement>()
    containerRef.current = container
    render(<ImageFloatingUI containerRef={containerRef} editor={editor as never} />, {
      wrapper: Wrapper,
    })
    await user.click(await screen.findByRole('button', { name: '代替テキスト（alt）' }))
    const input = screen.getByRole('textbox', { name: /^代替テキスト/ })
    await user.type(input, '説明')

    act(() => {
      editor.commands.insertContentAt(1, '前', { updateSelection: false })
    })

    expect(screen.getByRole('dialog', { name: '代替テキスト（alt）' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /^代替テキスト/ })).toHaveValue('説明')

    editor.destroy()
    container.remove()
  })

  it('削除ボタンを押すと選択中の画像を消す。画像の位置が動いていても動いた先を消す', async () => {
    const user = userEvent.setup()
    const editor = new Editor({
      extensions: configureExtensions({ features: ALL_FEATURES }),
      content: imageDoc,
    })
    const container = document.createElement('div')
    document.body.append(container)
    onTestFinished(() => {
      editor.destroy()
      container.remove()
    })
    editor.commands.setNodeSelection(2)

    render(<ImageFloatingUI containerRef={{ current: container }} editor={editor as never} />, {
      wrapper: Wrapper,
    })
    const deleteButton = await screen.findByRole('button', { name: '画像を削除' })

    act(() => {
      editor.commands.insertContentAt(1, '前', { updateSelection: false })
    })
    await user.click(deleteButton)

    expect(editor.$node('image')).toBeNull()
    expect(editor.getText().trim()).toBe('前')
    expect(screen.queryByRole('toolbar', { name: '画像の操作' })).not.toBeInTheDocument()
  })

  it('配置で中央を選ぶと align が center になり、左で null に戻る', async () => {
    const user = userEvent.setup()
    const editor = new Editor({
      extensions: configureExtensions({ features: ALL_FEATURES }),
      content: imageDoc,
    })
    const container = document.createElement('div')
    document.body.append(container)
    onTestFinished(() => {
      editor.destroy()
      container.remove()
    })
    editor.commands.setNodeSelection(2)

    render(<ImageFloatingUI containerRef={{ current: container }} editor={editor as never} />, {
      wrapper: Wrapper,
    })

    await user.click(await screen.findByRole('button', { name: '配置: 左揃え' }))
    await user.click(screen.getByRole('option', { name: '中央揃え' }))
    expect(editor.$node('image')?.attributes.align).toBe('center')

    await user.click(screen.getByRole('button', { name: '配置: 中央揃え' }))
    await user.click(screen.getByRole('option', { name: '左揃え' }))
    expect(editor.$node('image')?.attributes.align).toBeNull()
  })

  it.each(['Shift-F10', 'Alt-Enter'])(
    '画像を選んで %s を押すと、操作バーの先頭のボタンへ移る',
    async (key) => {
      const editor = new Editor({
        extensions: configureExtensions({ features: ALL_FEATURES }),
        content: imageDoc,
      })
      const container = document.createElement('div')
      document.body.append(container)
      onTestFinished(() => {
        editor.destroy()
        container.remove()
      })
      editor.commands.setNodeSelection(2)

      render(<ImageFloatingUI containerRef={{ current: container }} editor={editor as never} />, {
        wrapper: Wrapper,
      })
      await screen.findByRole('toolbar', { name: '画像の操作' })

      act(() => {
        editor.commands.keyboardShortcut(key)
      })

      expect(screen.getByRole('button', { name: '代替テキスト（alt）' })).toHaveFocus()
    },
  )

  it('キーボードで画像を削除すると、本文へフォーカスが戻る', async () => {
    const user = userEvent.setup()
    const element = document.createElement('div')
    document.body.append(element)
    const editor = new Editor({
      element,
      extensions: configureExtensions({ features: ALL_FEATURES }),
      content: imageDoc,
    })
    const container = document.createElement('div')
    document.body.append(container)
    onTestFinished(() => {
      editor.destroy()
      element.remove()
      container.remove()
    })
    editor.commands.setNodeSelection(2)

    render(<ImageFloatingUI containerRef={{ current: container }} editor={editor as never} />, {
      wrapper: Wrapper,
    })
    screen.getByRole('button', { name: '画像を削除' }).focus()
    await user.keyboard('{Enter}')

    expect(editor.$node('image')).toBeNull()
    await waitFor(() => expect(editor.view.dom).toHaveFocus())
  })
})
