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

const openDropdown = async (user: ReturnType<typeof userEvent.setup>) => {
  const trigger = screen.getByRole('button', { name: /行送り/ })
  await user.click(trigger)
  return trigger
}

describe('LineHeightDropdown', () => {
  it('トリガーが行送りラベルで表示される', async () => {
    render(<RichTextEditor features={['lineHeight']} />, { wrapper: Wrapper })
    await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())
    expect(screen.getByRole('button', { name: /行送り/ })).toBeInTheDocument()
  })

  it('トリガーの aria-label に現在値（デフォルトは標準）が含まれる', async () => {
    render(<RichTextEditor features={['lineHeight']} />, { wrapper: Wrapper })
    await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())
    expect(screen.getByRole('button', { name: '行送り: 1.75（標準）' })).toBeInTheDocument()
  })

  it('現在値ありのとき aria-label に値が反映される', async () => {
    render(
      <RichTextEditor
        features={['lineHeight']}
        defaultValue={{
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              attrs: { lineHeight: '2' },
              content: [{ type: 'text', text: 'a' }],
            },
          ],
        }}
      />,
      { wrapper: Wrapper },
    )
    await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())
    expect(screen.getByRole('button', { name: '行送り: 2' })).toBeInTheDocument()
  })

  it('lineHeight=1.75（CSSデフォルト同値）は標準として選択表示される', async () => {
    const user = userEvent.setup()
    render(
      <RichTextEditor
        features={['lineHeight']}
        defaultValue={{
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              attrs: { lineHeight: '1.75' },
              content: [{ type: 'text', text: 'a' }],
            },
          ],
        }}
      />,
      { wrapper: Wrapper },
    )
    await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())
    // トリガーは「標準」表示
    expect(screen.getByRole('button', { name: '行送り: 1.75（標準）' })).toBeInTheDocument()
    // メニュー内で「1.75（標準）」が選択状態
    await openDropdown(user)
    const selectedOption = screen.getByRole('option', { name: '1.75（標準）' })
    expect(selectedOption).toHaveAttribute('aria-selected', 'true')
  })

  it('開くと 5 つの選択肢が出る（標準サフィックス付き含む）', async () => {
    const user = userEvent.setup()
    render(<RichTextEditor features={['lineHeight']} />, { wrapper: Wrapper })
    await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())
    await openDropdown(user)
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(5)
    expect(screen.getByText('1.75（標準）')).toBeInTheDocument()
  })

  it('値を選ぶと本文段落に line-height が適用される', async () => {
    const user = userEvent.setup()
    render(
      <RichTextEditor
        features={['lineHeight']}
        defaultValue={{
          type: 'doc',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'abc' }] }],
        }}
      />,
      { wrapper: Wrapper },
    )
    await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())
    await openDropdown(user)
    await user.click(screen.getByRole('option', { name: '2' }))
    await waitFor(() => {
      const p = screen.getByRole('textbox').querySelector('p')
      expect(p?.getAttribute('style') ?? '').toContain('line-height: 2')
    })
  })

  it('1.75（標準）を選ぶと line-height 属性が消える', async () => {
    const user = userEvent.setup()
    render(
      <RichTextEditor
        features={['lineHeight']}
        defaultValue={{
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              attrs: { lineHeight: '2' },
              content: [{ type: 'text', text: 'abc' }],
            },
          ],
        }}
      />,
      { wrapper: Wrapper },
    )
    await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())
    await openDropdown(user)
    await user.click(screen.getByRole('option', { name: '1.75（標準）' }))
    await waitFor(() => {
      const p = screen.getByRole('textbox').querySelector('p')
      expect(p?.getAttribute('style') ?? '').not.toContain('line-height')
    })
  })
})
