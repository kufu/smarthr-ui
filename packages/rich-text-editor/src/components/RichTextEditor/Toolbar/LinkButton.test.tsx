import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IntlProvider } from 'smarthr-ui'
import { describe, expect, it } from 'vitest'

import { RichTextEditor } from '../RichTextEditor/RichTextEditor'

import type { RichTextJSON } from '../types'
import type { TiptapEditorHTMLElement } from '@tiptap/core'
import type { ReactNode } from 'react'

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">{children}</IntlProvider>
)

const INVALID_MESSAGE = '有効なURLを入力してください'

const applyLink = async (user: ReturnType<typeof userEvent.setup>, url: string) => {
  render(<RichTextEditor features={['link']} />, { wrapper: Wrapper })
  await waitFor(() => expect(screen.getByRole('textbox', { name: '' })).toBeInTheDocument())
  await user.click(screen.getByRole('button', { name: 'リンク' }))

  // ポップアップは開いた直後に requestAnimationFrame でURL入力へフォーカスを移すため、
  // それを待たずに入力すると打鍵の途中でフォーカスが飛んで別の欄に入ってしまう
  const urlInput = screen.getByRole('textbox', { name: /^リンク/ })
  await waitFor(() => expect(urlInput).toHaveFocus())

  await user.type(urlInput, url)
  await user.click(screen.getByRole('button', { name: '適用' }))
}

describe('LinkButton', () => {
  it('スキームだけでホストがないURLは適用できない', async () => {
    const user = userEvent.setup()
    await applyLink(user, 'https://')

    expect(screen.getByText(INVALID_MESSAGE)).toBeInTheDocument()
    expect(document.querySelector('.ProseMirror a')).toBeNull()
  })

  it('宛先のない mailto は適用できない', async () => {
    const user = userEvent.setup()
    await applyLink(user, 'mailto:')

    expect(screen.getByText(INVALID_MESSAGE)).toBeInTheDocument()
    expect(document.querySelector('.ProseMirror a')).toBeNull()
  })

  it('有効なURLは適用できる', async () => {
    const user = userEvent.setup()
    await applyLink(user, 'https://example.com/page')

    expect(document.querySelector('.ProseMirror a')).toHaveAttribute(
      'href',
      'https://example.com/page',
    )
  })

  it('リンク適用中でも切り替えボタンとして読み上げさせない', async () => {
    const user = userEvent.setup()
    await applyLink(user, 'https://example.com/page')

    const button = screen.getByRole('button', { name: 'リンク' })
    expect(button).not.toHaveAttribute('aria-pressed')
    expect(button).toHaveAttribute('data-active')
  })

  describe('開いたときの初期値と適用', () => {
    const getEditor = () =>
      (screen.getByRole('textbox', { name: '' }) as TiptapEditorHTMLElement).editor!
    const textInput = () => screen.getByRole('textbox', { name: 'テキスト' })
    const urlInput = () => screen.getByRole('textbox', { name: /^リンク/ })

    const renderWith = async (defaultValue: RichTextJSON) => {
      render(<RichTextEditor defaultValue={defaultValue} features={['link']} />, {
        wrapper: Wrapper,
      })
      await waitFor(() => expect(screen.getByRole('textbox', { name: '' })).toBeInTheDocument())
    }

    const openPopup = async (user: ReturnType<typeof userEvent.setup>) => {
      await user.click(screen.getByRole('button', { name: 'リンク' }))
      await waitFor(() => expect(urlInput()).toHaveFocus())
    }

    const plainDoc: RichTextJSON = {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'hello world' }] }],
    }

    const linkedDoc: RichTextJSON = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'hello',
              marks: [{ type: 'link', attrs: { href: 'https://example.com/old' } }],
            },
            { type: 'text', text: ' world' },
          ],
        },
      ],
    }

    it('選択中の文字列をテキストに入れ、適用するとその文字列をリンクにする', async () => {
      const user = userEvent.setup()
      await renderWith(plainDoc)
      // 「world」を選ぶ
      act(() => {
        getEditor().commands.setTextSelection({ from: 7, to: 12 })
      })

      await openPopup(user)
      expect(textInput()).toHaveValue('world')
      expect(urlInput()).toHaveValue('')

      await user.type(urlInput(), 'https://example.com/')
      await user.click(screen.getByRole('button', { name: '適用' }))

      const link = document.querySelector('.ProseMirror a')
      expect(link).toHaveTextContent(/^world$/)
      expect(link).toHaveAttribute('href', 'https://example.com/')
      expect(document.querySelector('.ProseMirror p')).toHaveTextContent('hello world')
    })

    it('テキストを書き換えて適用すると、選択中の文字列を書き換えた文字列のリンクに置き換える', async () => {
      const user = userEvent.setup()
      await renderWith(plainDoc)
      act(() => {
        getEditor().commands.setTextSelection({ from: 7, to: 12 })
      })

      await openPopup(user)
      await user.clear(textInput())
      await user.type(textInput(), '世界')
      await user.type(urlInput(), 'https://example.com/')
      await user.click(screen.getByRole('button', { name: '適用' }))

      expect(document.querySelector('.ProseMirror a')).toHaveTextContent(/^世界$/)
      expect(document.querySelector('.ProseMirror p')).toHaveTextContent('hello 世界')
    })

    it('リンクの中にキャレットがあると、リンク全体の文字列と URL を入れ、URL の変更はリンク全体に効く', async () => {
      const user = userEvent.setup()
      await renderWith(linkedDoc)
      // 「hello」の途中にキャレットを置く
      act(() => {
        getEditor().commands.setTextSelection(3)
      })

      await openPopup(user)
      expect(textInput()).toHaveValue('hello')
      expect(urlInput()).toHaveValue('https://example.com/old')

      await user.clear(urlInput())
      await user.type(urlInput(), 'https://example.com/new')
      await user.click(screen.getByRole('button', { name: '適用' }))

      const links = document.querySelectorAll('.ProseMirror a')
      expect(links).toHaveLength(1)
      expect(links[0]).toHaveTextContent(/^hello$/)
      expect(links[0]).toHaveAttribute('href', 'https://example.com/new')
    })

    it('リンクを解除すると、リンク全体から外す', async () => {
      const user = userEvent.setup()
      await renderWith(linkedDoc)
      act(() => {
        getEditor().commands.setTextSelection(3)
      })

      await openPopup(user)
      await user.click(screen.getByRole('button', { name: 'リンクを解除' }))

      expect(document.querySelector('.ProseMirror a')).toBeNull()
      expect(document.querySelector('.ProseMirror p')).toHaveTextContent('hello world')
    })
  })

  describe('Mod-K', () => {
    const pressModK = () =>
      fireEvent.keyDown(screen.getByRole('textbox', { name: '' }), { key: 'k', ctrlKey: true })

    it('リンクのポップオーバーを開く', async () => {
      render(<RichTextEditor features={['link']} />, { wrapper: Wrapper })
      await waitFor(() => expect(screen.getByRole('textbox', { name: '' })).toBeInTheDocument())

      pressModK()

      expect(await screen.findByRole('dialog', { name: 'リンク' })).toBeInTheDocument()
    })

    it('水平線を選んでいてボタンが無効な間は開かず、水平線も置き換えない', async () => {
      render(
        <RichTextEditor
          defaultValue={{
            type: 'doc',
            content: [{ type: 'horizontalRule' }, { type: 'paragraph' }],
          }}
          features={['link', 'horizontalRule']}
        />,
        { wrapper: Wrapper },
      )
      await waitFor(() => expect(screen.getByRole('textbox', { name: '' })).toBeInTheDocument())
      const editor = (screen.getByRole('textbox', { name: '' }) as TiptapEditorHTMLElement).editor!
      act(() => {
        editor.commands.setNodeSelection(0)
      })
      await waitFor(() => expect(screen.getByRole('button', { name: 'リンク' })).toBeDisabled())

      pressModK()

      expect(screen.queryByRole('dialog', { name: 'リンク' })).not.toBeInTheDocument()
      expect(document.querySelector('.ProseMirror hr')).toBeInTheDocument()
    })
  })
})
