import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IntlProvider } from 'smarthr-ui'
import { describe, expect, it } from 'vitest'

import { RichTextEditor } from '../RichTextEditor/RichTextEditor'

import type { ReactNode } from 'react'

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">{children}</IntlProvider>
)

const H1_DOC = {
  type: 'doc',
  content: [{ type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: '見出し' }] }],
}

const renderEditor = async () => {
  render(<RichTextEditor defaultValue={H1_DOC} features={['heading']} headingLevels={[2, 3]} />, {
    wrapper: Wrapper,
  })
  await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())
}

describe('HeadingDropdown', () => {
  it('許可外のレベルの見出しでも現在の書式を表示する', async () => {
    await renderEditor()

    expect(screen.getByRole('button', { name: '書式: 見出し1' })).toBeInTheDocument()
  })

  it('選択肢は許可レベルだけ出す', async () => {
    const user = userEvent.setup()
    await renderEditor()

    await user.click(screen.getByRole('button', { name: '書式: 見出し1' }))

    const listbox = screen.getByRole('listbox')
    expect(within(listbox).getByRole('option', { name: '標準テキスト' })).toBeInTheDocument()
    expect(within(listbox).getByRole('option', { name: '見出し2' })).toBeInTheDocument()
    expect(within(listbox).getByRole('option', { name: '見出し3' })).toBeInTheDocument()
    expect(within(listbox).queryByRole('option', { name: '見出し1' })).not.toBeInTheDocument()
    expect(within(listbox).queryByRole('option', { name: '見出し4' })).not.toBeInTheDocument()
  })
})
