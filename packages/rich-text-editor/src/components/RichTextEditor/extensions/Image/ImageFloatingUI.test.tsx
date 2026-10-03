import { render, screen, waitFor } from '@testing-library/react'
import { Editor } from '@tiptap/core'
import { createRef } from 'react'
import { IntlProvider } from 'smarthr-ui'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

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
  })
})
