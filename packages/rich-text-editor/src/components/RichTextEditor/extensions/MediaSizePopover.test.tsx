import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Editor } from '@tiptap/core'
import { IntlProvider } from 'smarthr-ui'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'

import { IMAGE_SIZE_SPEC, MediaSizePopover, YOUTUBE_SIZE_SPEC } from './MediaSizePopover'
import { ALL_FEATURES, configureExtensions } from './configureExtensions'

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

describe('画像', () => {
  it('開いている間に画像の位置が動いても、入力中の幅と高さを保ったまま動いた先の画像へ適用する', async () => {
    const user = userEvent.setup()
    const editor = createEditor()

    const { rerender } = render(
      <MediaSizePopover editor={editor as never} pos={2} spec={IMAGE_SIZE_SPEC} />,
      {
        wrapper: Wrapper,
      },
    )
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
    rerender(<MediaSizePopover editor={editor as never} pos={3} spec={IMAGE_SIZE_SPEC} />)

    expect(widthInput).toHaveValue(300)
    expect(heightInput).toHaveValue(90)

    await user.click(screen.getByRole('button', { name: '適用' }))

    expect(editor.state.doc.nodeAt(3)?.attrs).toMatchObject({ width: 300, height: 90 })
  })

  it('リセットすると寸法の指定を外して閉じ、トリガーへフォーカスが戻る', async () => {
    const user = userEvent.setup()
    const editor = createEditor()

    render(<MediaSizePopover editor={editor as never} pos={2} spec={IMAGE_SIZE_SPEC} />, {
      wrapper: Wrapper,
    })
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

    render(<MediaSizePopover editor={editor as never} pos={2} spec={IMAGE_SIZE_SPEC} />, {
      wrapper: Wrapper,
    })
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

describe('鍵アイコン', () => {
  it('「縦横比を固定」は独立した読み上げ対象にせず、幅と高さの入力欄の説明にする', async () => {
    const user = userEvent.setup()
    const editor = createEditor()

    render(<MediaSizePopover editor={editor as never} pos={2} spec={IMAGE_SIZE_SPEC} />, {
      wrapper: Wrapper,
    })
    await user.click(screen.getByRole('button', { name: 'サイズ' }))

    expect(screen.getByRole('spinbutton', { name: '幅 (px)' })).toHaveAccessibleDescription(
      '縦横比を固定',
    )
    expect(screen.getByRole('spinbutton', { name: '高さ (px)' })).toHaveAccessibleDescription(
      '縦横比を固定',
    )
    const texts = screen.getAllByText('縦横比を固定')
    expect(texts).toHaveLength(1)
    expect(texts[0]).not.toBeVisible()
    expect(screen.queryByRole('img', { name: '縦横比を固定' })).not.toBeInTheDocument()
  })
})

const createYoutubeEditor = (attrs: Record<string, unknown> = { width: 320, height: 180 }) => {
  const editor = new Editor({
    extensions: configureExtensions({ features: ALL_FEATURES }),
    content: {
      type: 'doc',
      content: [
        { type: 'paragraph' },
        {
          type: 'youtube',
          attrs: { ...attrs, src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        },
      ],
    },
  })
  editors.push(editor)
  editor.commands.setNodeSelection(2)

  return editor
}

describe('YouTube', () => {
  const open = async (editor: Editor) => {
    const user = userEvent.setup()
    render(<MediaSizePopover editor={editor as never} pos={2} spec={YOUTUBE_SIZE_SPEC} />, {
      wrapper: Wrapper,
    })
    await user.click(screen.getByRole('button', { name: 'サイズ' }))

    return {
      user,
      widthInput: screen.getByRole('spinbutton', { name: '幅 (px)' }),
      heightInput: screen.getByRole('spinbutton', { name: '高さ (px)' }),
    }
  }

  it('640×480 の既存の動画でも、高さは幅から 16:9 で出す', async () => {
    const { widthInput, heightInput } = await open(createYoutubeEditor({ width: 640, height: 480 }))
    expect(widthInput).toHaveValue(640)
    expect(heightInput).toHaveValue(360)
  })

  it('幅を変えると高さが 16:9 で、高さを変えると幅が追従する', async () => {
    const editor = createYoutubeEditor()
    const { user, widthInput, heightInput } = await open(editor)

    await user.clear(widthInput)
    await user.type(widthInput, '480')
    expect(heightInput).toHaveValue(270)

    await user.clear(heightInput)
    await user.type(heightInput, '360')
    expect(widthInput).toHaveValue(640)

    await user.click(screen.getByRole('button', { name: '適用' }))
    expect(editor.state.doc.nodeAt(2)?.attrs).toMatchObject({ width: 640, height: 360 })
  })

  it('最小幅より小さい幅は 356×200 に切り上げて保存する', async () => {
    const editor = createYoutubeEditor()
    const { user, widthInput } = await open(editor)

    await user.clear(widthInput)
    await user.type(widthInput, '100')
    await user.click(screen.getByRole('button', { name: '適用' }))

    expect(editor.state.doc.nodeAt(2)?.attrs).toMatchObject({ width: 356, height: 200 })
  })

  it('幅が空のまま適用しても寸法を変えない', async () => {
    const editor = createYoutubeEditor()
    const { user, widthInput } = await open(editor)

    await user.clear(widthInput)
    await user.click(screen.getByRole('button', { name: '適用' }))

    expect(editor.state.doc.nodeAt(2)?.attrs).toMatchObject({ width: 320, height: 180 })
  })

  it('リセットすると 640×360 に戻す', async () => {
    const editor = createYoutubeEditor()
    const { user } = await open(editor)

    await user.click(screen.getByRole('button', { name: 'リセット' }))

    expect(editor.state.doc.nodeAt(2)?.attrs).toMatchObject({ width: 640, height: 360 })
  })
})
