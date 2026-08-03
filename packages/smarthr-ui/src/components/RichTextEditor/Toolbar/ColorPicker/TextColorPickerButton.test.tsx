import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { IntlProvider } from '../../../../intl'
import { RichTextEditor } from '../../RichTextEditor/RichTextEditor'

import type { ReactNode } from 'react'

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">{children}</IntlProvider>
)

const renderEditor = async (html: string) => {
  render(
    <RichTextEditor features={['color', 'fontSize']} content={{ format: 'html', content: html }} />,
    { wrapper: Wrapper },
  )
  await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())
}

describe('TextColorPickerButton', () => {
  it('文字色未指定のときはパレットの既定色（黒）が選択状態になる', async () => {
    const user = userEvent.setup()
    await renderEditor('<p>plain</p>')
    await user.click(screen.getByRole('button', { name: '文字色' }))
    expect(screen.getByRole('button', { name: '黒' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('フォントサイズだけ指定されたHTMLでもパレットの既定色（黒）が選択状態になる', async () => {
    const user = userEvent.setup()
    await renderEditor('<p><span style="font-size: 20px">big</span></p>')
    await user.click(screen.getByRole('button', { name: '文字色' }))
    expect(screen.getByRole('button', { name: '黒' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('文字色指定ありのときは既定色が選択状態にならない', async () => {
    const user = userEvent.setup()
    await renderEditor('<p><span style="color: #e01e5a">red</span></p>')
    await user.click(screen.getByRole('button', { name: '文字色' }))
    expect(screen.getByRole('button', { name: '黒' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: '赤' })).toHaveAttribute('aria-pressed', 'true')
  })
})
