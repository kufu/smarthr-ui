import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IntlProvider } from 'smarthr-ui'
import { beforeAll, describe, expect, it } from 'vitest'

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

  it('rem 指定のときはルートフォントサイズ換算の数値を表示する', async () => {
    await renderEditor('<p><span style="font-size: 1.25rem">big</span></p>')
    expect(screen.getByRole('button', { name: 'フォントサイズ: 20' })).toBeInTheDocument()
  })

  it('rem 指定のときは対応する選択肢が選択状態になる', async () => {
    const user = userEvent.setup()
    await renderEditor('<p><span style="font-size: 1.25rem">big</span></p>')
    await user.click(screen.getByRole('button', { name: /フォントサイズ/ }))
    expect(screen.getByRole('option', { name: '20' })).toHaveAttribute('aria-selected', 'true')
  })

  // 他エディタからの移行や外部HTMLのペーストで px が入ってくる
  it('px 指定のときも対応する選択肢が選択状態になる', async () => {
    const user = userEvent.setup()
    await renderEditor('<p><span style="font-size: 20px">big</span></p>')
    await user.click(screen.getByRole('button', { name: /フォントサイズ/ }))
    expect(screen.getByRole('option', { name: '20' })).toHaveAttribute('aria-selected', 'true')
  })

  it('px 指定のときもキーボードで開くと対応する選択肢にフォーカスする', async () => {
    const user = userEvent.setup()
    await renderEditor('<p><span style="font-size: 20px">big</span></p>')
    screen.getByRole('button', { name: /フォントサイズ/ }).focus()
    await user.keyboard('{ArrowDown}')
    await waitFor(() => expect(screen.getByRole('option', { name: '20' })).toHaveFocus())
  })

  it('一覧に無いサイズはラベルに出しつつどの選択肢も選択状態にしない', async () => {
    const user = userEvent.setup()
    await renderEditor('<p><span style="font-size: 9px">small</span></p>')
    expect(screen.getByRole('button', { name: 'フォントサイズ: 9' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /フォントサイズ/ }))
    expect(
      screen.getAllByRole('option').filter((o) => o.getAttribute('aria-selected') === 'true'),
    ).toHaveLength(0)
  })

  // NOTE: jsdomではcontenteditable divへの入力が動作せずspanを生成できないため、
  // 適用した値はトリガーのラベル経由で確認する
  it('選択肢を選ぶとその値がエディタに適用される', async () => {
    const user = userEvent.setup()
    await renderEditor('<p>plain</p>')
    await user.click(screen.getByRole('button', { name: /フォントサイズ/ }))
    await user.click(screen.getByRole('option', { name: '24' }))
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'フォントサイズ: 24' })).toBeInTheDocument(),
    )
  })
})
