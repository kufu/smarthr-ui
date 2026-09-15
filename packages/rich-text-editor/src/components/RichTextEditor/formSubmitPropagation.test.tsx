import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Editor } from '@tiptap/core'
import { IntlProvider } from 'smarthr-ui'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import { RichTextEditor } from './RichTextEditor/RichTextEditor'
import { ImageAltPopover } from './extensions/Image/ImageAltPopover'
import { ImageWidthPopover } from './extensions/Image/ImageWidthPopover'
import { ALL_FEATURES, configureExtensions } from './extensions/configureExtensions'

import type { FormEvent, ReactNode } from 'react'

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

const renderInParentForm = (children: ReactNode) => {
  const onParentSubmit = vi.fn((e: FormEvent<HTMLFormElement>) => e.preventDefault())

  render(
    <form onSubmit={onParentSubmit}>
      {children}
      <button type="submit">保存</button>
    </form>,
    { wrapper: Wrapper },
  )

  return onParentSubmit
}

const waitForEditor = () =>
  waitFor(() => expect(screen.getByRole('textbox', { name: '' })).toBeInTheDocument())

const editors: Editor[] = []
afterEach(() => {
  while (editors.length > 0) editors.pop()?.destroy()
})

const createImageEditor = () => {
  const editor = new Editor({
    extensions: configureExtensions({ features: ALL_FEATURES }),
    content: {
      type: 'doc',
      content: [{ type: 'image', attrs: { src: 'https://example.com/a.png', alt: '' } }],
    },
  })
  editor.commands.setNodeSelection(0)
  editors.push(editor)

  return editor
}

describe('ポップオーバーのフォーム送信', () => {
  describe('リンク', () => {
    const openPopover = async (user: ReturnType<typeof userEvent.setup>) => {
      const onChange = vi.fn()
      const onParentSubmit = renderInParentForm(
        <RichTextEditor features={['link']} onChange={onChange} />,
      )
      await waitForEditor()
      await user.click(screen.getByRole('button', { name: 'リンク' }))

      // ポップアップは開いた直後に requestAnimationFrame でURL入力へフォーカスを移す
      const urlInput = screen.getByRole('textbox', { name: /^リンク/ })
      await waitFor(() => expect(urlInput).toHaveFocus())

      return { onParentSubmit, onChange, urlInput }
    }

    it('有効なURLの適用で親フォームが送信されない', async () => {
      const user = userEvent.setup()
      const { onParentSubmit, onChange, urlInput } = await openPopover(user)

      await user.type(urlInput, 'https://example.com/page')
      await user.click(screen.getByRole('button', { name: '適用' }))

      expect(onParentSubmit).not.toHaveBeenCalled()
      expect(document.querySelector('.ProseMirror a')).toHaveAttribute(
        'href',
        'https://example.com/page',
      )
      expect(onChange).toHaveBeenCalled()
    })

    it('無効なURLの適用で親フォームが送信されない', async () => {
      const user = userEvent.setup()
      const { onParentSubmit, urlInput } = await openPopover(user)

      await user.type(urlInput, 'https://')
      await user.click(screen.getByRole('button', { name: '適用' }))

      expect(onParentSubmit).not.toHaveBeenCalled()
    })

    it('入力欄のEnterで親フォームが送信されない', async () => {
      const user = userEvent.setup()
      const { onParentSubmit, urlInput } = await openPopover(user)

      await user.type(urlInput, 'https://example.com/page{Enter}')

      expect(onParentSubmit).not.toHaveBeenCalled()
    })

    it('親フォームの保存ボタンでは親フォームが送信される', async () => {
      const user = userEvent.setup()
      const { onParentSubmit } = await openPopover(user)

      await user.click(screen.getByRole('button', { name: '保存' }))

      expect(onParentSubmit).toHaveBeenCalledTimes(1)
    })
  })

  describe('YouTube', () => {
    const openPopover = async (user: ReturnType<typeof userEvent.setup>) => {
      const onParentSubmit = renderInParentForm(<RichTextEditor features={['youtube']} />)
      await waitForEditor()
      await user.click(screen.getByRole('button', { name: 'YouTube動画を埋め込む' }))

      const urlInput = screen.getByRole('textbox', { name: /^YouTube URL/ })
      await waitFor(() => expect(urlInput).toHaveFocus())

      return { onParentSubmit, urlInput }
    }

    it('埋め込みで親フォームが送信されない', async () => {
      const user = userEvent.setup()
      const { onParentSubmit, urlInput } = await openPopover(user)

      await user.type(urlInput, 'https://www.youtube.com/watch?v=abcdefghijk')
      await user.click(screen.getByRole('button', { name: '埋め込む' }))

      expect(onParentSubmit).not.toHaveBeenCalled()
      expect(document.querySelector('.ProseMirror iframe')).toBeInTheDocument()
    })

    it('無効なURLの埋め込みで親フォームが送信されない', async () => {
      const user = userEvent.setup()
      const { onParentSubmit, urlInput } = await openPopover(user)

      await user.type(urlInput, 'https://example.com/')
      await user.click(screen.getByRole('button', { name: '埋め込む' }))

      expect(onParentSubmit).not.toHaveBeenCalled()
    })

    it('入力欄のEnterで親フォームが送信されない', async () => {
      const user = userEvent.setup()
      const { onParentSubmit, urlInput } = await openPopover(user)

      await user.type(urlInput, 'https://www.youtube.com/watch?v=abcdefghijk{Enter}')

      expect(onParentSubmit).not.toHaveBeenCalled()
    })
  })

  describe('表の挿入', () => {
    const openPopover = async (user: ReturnType<typeof userEvent.setup>) => {
      const onParentSubmit = renderInParentForm(<RichTextEditor features={['table']} />)
      await waitForEditor()
      await user.click(screen.getByRole('button', { name: 'テーブルを挿入' }))

      const rowsInput = screen.getByRole('spinbutton', { name: '行数' })
      await waitFor(() => expect(rowsInput).toHaveFocus())

      return { onParentSubmit, rowsInput }
    }

    it('挿入で親フォームが送信されない', async () => {
      const user = userEvent.setup()
      const { onParentSubmit } = await openPopover(user)

      await user.click(screen.getByRole('button', { name: '挿入' }))

      expect(onParentSubmit).not.toHaveBeenCalled()
      expect(document.querySelector('.ProseMirror table')).toBeInTheDocument()
    })

    it('無効な行数の挿入で親フォームが送信されない', async () => {
      const user = userEvent.setup()
      const { onParentSubmit, rowsInput } = await openPopover(user)

      await user.clear(rowsInput)
      await user.type(rowsInput, '0')
      await user.click(screen.getByRole('button', { name: '挿入' }))

      expect(onParentSubmit).not.toHaveBeenCalled()
    })

    it('入力欄のEnterで親フォームが送信されない', async () => {
      const user = userEvent.setup()
      const { onParentSubmit, rowsInput } = await openPopover(user)

      await user.type(rowsInput, '{Enter}')

      expect(onParentSubmit).not.toHaveBeenCalled()
    })
  })

  describe('画像URLの挿入', () => {
    const openPopover = async (user: ReturnType<typeof userEvent.setup>) => {
      const onParentSubmit = renderInParentForm(<RichTextEditor features={['image']} />)
      await waitForEditor()
      await user.click(screen.getByRole('button', { name: '画像を挿入' }))
      await user.click(screen.getByRole('menuitem', { name: 'URLから挿入' }))

      return { onParentSubmit, urlInput: screen.getByRole('textbox', { name: /^画像URL/ }) }
    }

    it('挿入で親フォームが送信されない', async () => {
      const user = userEvent.setup()
      const { onParentSubmit, urlInput } = await openPopover(user)

      await user.type(urlInput, 'https://example.com/a.png')
      await user.click(screen.getByRole('button', { name: '挿入' }))

      expect(onParentSubmit).not.toHaveBeenCalled()
      expect(document.querySelector('.ProseMirror img')).toBeInTheDocument()
    })

    it('無効なURLの挿入で親フォームが送信されない', async () => {
      const user = userEvent.setup()
      const { onParentSubmit, urlInput } = await openPopover(user)

      await user.type(urlInput, 'https://')
      await user.click(screen.getByRole('button', { name: '挿入' }))

      expect(onParentSubmit).not.toHaveBeenCalled()
    })

    it('入力欄のEnterで親フォームが送信されない', async () => {
      const user = userEvent.setup()
      const { onParentSubmit, urlInput } = await openPopover(user)

      await user.type(urlInput, 'https://example.com/a.png{Enter}')

      expect(onParentSubmit).not.toHaveBeenCalled()
    })
  })

  describe('画像の代替テキスト', () => {
    const openPopover = async (user: ReturnType<typeof userEvent.setup>) => {
      const editor = createImageEditor()
      const onParentSubmit = renderInParentForm(<ImageAltPopover editor={editor} pos={0} />)
      await user.click(screen.getByRole('button', { name: '代替テキスト（alt）' }))

      return {
        editor,
        onParentSubmit,
        altInput: screen.getByRole('textbox', { name: /^代替テキスト/ }),
      }
    }

    it('適用で親フォームが送信されない', async () => {
      const user = userEvent.setup()
      const { editor, onParentSubmit, altInput } = await openPopover(user)

      await user.type(altInput, '説明')
      await user.click(screen.getByRole('button', { name: '適用' }))

      expect(onParentSubmit).not.toHaveBeenCalled()
      expect(editor.getJSON().content?.[0].attrs?.alt).toBe('説明')
    })

    it('入力欄のEnterで親フォームが送信されない', async () => {
      const user = userEvent.setup()
      const { onParentSubmit, altInput } = await openPopover(user)

      await user.type(altInput, '説明{Enter}')

      expect(onParentSubmit).not.toHaveBeenCalled()
    })
  })

  describe('画像のサイズ', () => {
    const openPopover = async (user: ReturnType<typeof userEvent.setup>) => {
      const editor = createImageEditor()
      const onParentSubmit = renderInParentForm(<ImageWidthPopover editor={editor} pos={0} />)
      await user.click(screen.getByRole('button', { name: 'サイズ' }))

      return {
        editor,
        onParentSubmit,
        widthInput: screen.getByRole('spinbutton', { name: '幅 (px)' }),
      }
    }

    it('適用で親フォームが送信されない', async () => {
      const user = userEvent.setup()
      const { editor, onParentSubmit, widthInput } = await openPopover(user)

      await user.clear(widthInput)
      await user.type(widthInput, '300')
      await user.click(screen.getByRole('button', { name: '適用' }))

      expect(onParentSubmit).not.toHaveBeenCalled()
      expect(editor.getJSON().content?.[0].attrs?.width).toBe(300)
    })

    it('入力欄のEnterで親フォームが送信されない', async () => {
      const user = userEvent.setup()
      const { onParentSubmit, widthInput } = await openPopover(user)

      await user.type(widthInput, '{Enter}')

      expect(onParentSubmit).not.toHaveBeenCalled()
    })
  })
})
