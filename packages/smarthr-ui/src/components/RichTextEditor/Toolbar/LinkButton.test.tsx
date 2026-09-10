import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { IntlProvider } from '../../../intl'
import { RichTextEditor } from '../RichTextEditor/RichTextEditor'

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
})
