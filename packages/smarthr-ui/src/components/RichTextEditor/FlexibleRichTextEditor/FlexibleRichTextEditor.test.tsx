import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { IntlProvider } from '../../../intl'

import { FlexibleRichTextEditor } from './FlexibleRichTextEditor'

import type { ReactNode } from 'react'

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">{children}</IntlProvider>
)

describe('FlexibleRichTextEditor', () => {
  it('HTML content を受け取ってエディタを描画する', async () => {
    render(
      <FlexibleRichTextEditor content={{ format: 'html', content: '<p>HTMLコンテンツ</p>' }} />,
      {
        wrapper: Wrapper,
      },
    )
    await waitFor(() => {
      expect(screen.getByText('HTMLコンテンツ')).toBeInTheDocument()
    })
  })

  it('JSON content を受け取ってエディタを描画する', async () => {
    render(
      <FlexibleRichTextEditor
        content={{
          format: 'json',
          content: {
            type: 'doc',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'JSONコンテンツ' }] }],
          },
        }}
      />,
      { wrapper: Wrapper },
    )
    await waitFor(() => {
      expect(screen.getByText('JSONコンテンツ')).toBeInTheDocument()
    })
  })

  it('empty content で空のエディタを描画する', async () => {
    render(<FlexibleRichTextEditor content={{ format: 'empty' }} />, { wrapper: Wrapper })
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
  })
})
