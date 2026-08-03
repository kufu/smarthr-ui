import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, describe, expect, it } from 'vitest'

import { IntlProvider } from '../../../intl'
import { RichTextEditor } from '../RichTextEditor/RichTextEditor'

import type { ReactNode } from 'react'

beforeAll(() => {
  if (typeof globalThis.ResizeObserver === 'undefined') {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver
  }
})

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">{children}</IntlProvider>
)

const renderEditor = async (html: string) => {
  render(
    <RichTextEditor features={['fontSize', 'color']} content={{ format: 'html', content: html }} />,
    {
      wrapper: Wrapper,
    },
  )
  await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())
}

describe('FontSizeDropdown', () => {
  it('フォントサイズ未指定のときは既定の16を表示する', async () => {
    await renderEditor('<p>plain</p>')
    expect(screen.getByRole('button', { name: 'フォントサイズ: 16' })).toBeInTheDocument()
  })

  it('色だけ指定されたHTMLでも既定の16を表示する', async () => {
    await renderEditor('<p><span style="color: #fff">white</span></p>')
    expect(screen.getByRole('button', { name: 'フォントサイズ: 16' })).toBeInTheDocument()
  })

  it('色だけ指定されたHTMLでは選択肢の16が選択状態になる', async () => {
    const user = userEvent.setup()
    await renderEditor('<p><span style="color: #fff">white</span></p>')
    await user.click(screen.getByRole('button', { name: /フォントサイズ/ }))
    expect(screen.getByRole('option', { name: '16' })).toHaveAttribute('aria-selected', 'true')
  })

  it('フォントサイズ指定ありのときはその値を表示する', async () => {
    await renderEditor('<p><span style="font-size: 20px">big</span></p>')
    expect(screen.getByRole('button', { name: 'フォントサイズ: 20' })).toBeInTheDocument()
  })
})
