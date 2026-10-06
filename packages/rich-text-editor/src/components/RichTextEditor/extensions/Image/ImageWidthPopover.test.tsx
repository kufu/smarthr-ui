import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Editor } from '@tiptap/core'
import { IntlProvider } from 'smarthr-ui'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'

import { ALL_FEATURES, configureExtensions } from '../configureExtensions'

import { ImageWidthPopover } from './ImageWidthPopover'

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

const createEditor = () => {
  const editor = new Editor({
    extensions: configureExtensions({ features: ALL_FEATURES }),
    content: {
      type: 'doc',
      content: [
        { type: 'paragraph' },
        {
          type: 'image',
          attrs: { src: 'https://example.com/a.png', alt: '', width: 120, height: 60 },
        },
      ],
    },
  })
  editors.push(editor)
  editor.commands.setNodeSelection(2)

  return editor
}

describe('ImageWidthPopover', () => {
  it('開いている間に画像の位置が動いても、入力中の幅と高さを保ったまま動いた先の画像へ適用する', async () => {
    const user = userEvent.setup()
    const editor = createEditor()

    const { rerender } = render(<ImageWidthPopover editor={editor as never} pos={2} />, {
      wrapper: Wrapper,
    })
    await user.click(screen.getByRole('button', { name: 'サイズ' }))
    const widthInput = screen.getByRole('spinbutton', { name: '幅 (px)' })
    const heightInput = screen.getByRole('spinbutton', { name: '高さ (px)' })
    await user.clear(widthInput)
    await user.type(widthInput, '300')
    await user.clear(heightInput)
    await user.type(heightInput, '90')

    act(() => {
      editor.commands.insertContentAt(1, '前', { updateSelection: false })
    })
    rerender(<ImageWidthPopover editor={editor as never} pos={3} />)

    expect(widthInput).toHaveValue(300)
    expect(heightInput).toHaveValue(90)

    await user.click(screen.getByRole('button', { name: '適用' }))

    expect(editor.state.doc.nodeAt(3)?.attrs).toMatchObject({ width: 300, height: 90 })
  })

  it('リセットすると寸法の指定を外して閉じ、トリガーへフォーカスが戻る', async () => {
    const user = userEvent.setup()
    const editor = createEditor()

    render(<ImageWidthPopover editor={editor as never} pos={2} />, { wrapper: Wrapper })
    const trigger = screen.getByRole('button', { name: 'サイズ' })
    await user.click(trigger)
    await user.click(screen.getByRole('button', { name: 'リセット' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
    expect(editor.state.doc.nodeAt(2)?.attrs).toMatchObject({ width: null, height: null })
  })

  it('幅を変えると画像本来の縦横比で高さが、高さを変えると幅が追従する', async () => {
    const user = userEvent.setup()
    const editor = createEditor()
    const img = editor.view.dom.querySelector('img')!
    Object.defineProperty(img, 'naturalWidth', { value: 400, configurable: true })
    Object.defineProperty(img, 'naturalHeight', { value: 100, configurable: true })

    render(<ImageWidthPopover editor={editor as never} pos={2} />, { wrapper: Wrapper })
    await user.click(screen.getByRole('button', { name: 'サイズ' }))
    const widthInput = screen.getByRole('spinbutton', { name: '幅 (px)' })
    const heightInput = screen.getByRole('spinbutton', { name: '高さ (px)' })

    await user.clear(widthInput)
    await user.type(widthInput, '300')
    expect(heightInput).toHaveValue(75)

    await user.clear(heightInput)
    await user.type(heightInput, '50')
    expect(widthInput).toHaveValue(200)

    await user.click(screen.getByRole('button', { name: '適用' }))

    expect(editor.state.doc.nodeAt(2)?.attrs).toMatchObject({ width: 200, height: 50 })
  })
})
