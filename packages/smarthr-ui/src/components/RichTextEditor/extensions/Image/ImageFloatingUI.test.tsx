import { render, screen, waitFor } from '@testing-library/react'
import { beforeAll, describe, expect, it } from 'vitest'

import { IntlProvider } from '../../../../intl'
import { RichTextEditor } from '../../RichTextEditor/RichTextEditor'

import type { ReactNode } from 'react'

// jsdom には ResizeObserver が無く、挿入された画像の NodeView がマウント時に参照するため、
// 最小限のスタブを用意する。
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

const imageDoc = {
  type: 'doc',
  content: [
    { type: 'paragraph' },
    { type: 'image', attrs: { src: 'https://example.com/a.png', alt: '' } },
  ],
}

describe('ImageFloatingUI', () => {
  it('画像未選択ではツールバー(画像の操作)は出ない', async () => {
    render(<RichTextEditor features={['image']} defaultValue={imageDoc} />, { wrapper: Wrapper })
    await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())
    expect(screen.queryByRole('toolbar', { name: '画像の操作' })).not.toBeInTheDocument()
  })

  it('readOnly では画像選択UIが出ない', async () => {
    render(<RichTextEditor features={['image']} defaultValue={imageDoc} readOnly />, {
      wrapper: Wrapper,
    })
    await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())
    expect(screen.queryByRole('toolbar', { name: '画像の操作' })).not.toBeInTheDocument()
  })
})
