import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { IntlProvider } from '../../../intl'
import { RichTextEditor } from '../RichTextEditor/RichTextEditor'

import type { ReactNode } from 'react'

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">{children}</IntlProvider>
)

const INVALID_MESSAGE = '有効なURL（http:// または https://）を入力してください'

const openUrlPopover = async (user: ReturnType<typeof userEvent.setup>) => {
  render(<RichTextEditor features={['image']} />, { wrapper: Wrapper })
  await waitFor(() => expect(screen.getByRole('textbox', { name: '' })).toBeInTheDocument())
  await user.click(screen.getByRole('button', { name: '画像を挿入' }))
  await user.click(screen.getByRole('menuitem', { name: 'URLから挿入' }))
}

describe('ImageUrlPopover', () => {
  it('スキームだけでホストがないURLは挿入できない', async () => {
    const user = userEvent.setup()
    await openUrlPopover(user)

    await user.type(screen.getByRole('textbox', { name: '画像URL' }), 'https://')
    await user.click(screen.getByRole('button', { name: '挿入' }))

    expect(screen.getByText(INVALID_MESSAGE)).toBeInTheDocument()
    expect(document.querySelector('.ProseMirror img')).toBeNull()
  })
})
