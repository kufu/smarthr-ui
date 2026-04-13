import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { IntlProvider } from '../../../intl'
import { FormControl } from '../../FormControl'

import { RichTextEditor } from './RichTextEditor'

import type { ReactNode } from 'react'

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">{children}</IntlProvider>
)

describe('RichTextEditor', () => {
  it('renders the editor', async () => {
    render(<RichTextEditor />, { wrapper: Wrapper })
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
  })

  it('renders toolbar when not readOnly', async () => {
    render(<RichTextEditor />, { wrapper: Wrapper })
    await waitFor(() => {
      expect(screen.getByRole('toolbar')).toBeInTheDocument()
    })
  })

  it('hides toolbar when readOnly', async () => {
    render(<RichTextEditor readOnly />, { wrapper: Wrapper })
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument()
  })

  it('renders toolbar buttons based on features', async () => {
    render(<RichTextEditor features={['bold', 'italic']} />, { wrapper: Wrapper })
    await waitFor(() => {
      expect(screen.getByRole('toolbar')).toBeInTheDocument()
    })
    expect(screen.getByLabelText('太字')).toBeInTheDocument()
    expect(screen.getByLabelText('斜体')).toBeInTheDocument()
    expect(screen.queryByLabelText('箇条書きリスト')).not.toBeInTheDocument()
  })

  // NOTE: jsdomではcontenteditable divへのuserEvent.typeが動作しないため、
  // onChangeの動作テストはStorybookのインタラクションテストで行う

  it('renders with defaultValue', async () => {
    const defaultValue = {
      type: 'doc' as const,
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Initial content' }],
        },
      ],
    }
    render(<RichTextEditor defaultValue={defaultValue} />, { wrapper: Wrapper })
    await waitFor(() => {
      expect(screen.getByText('Initial content')).toBeInTheDocument()
    })
  })

  it('integrates with FormControl', async () => {
    render(
      <IntlProvider locale="ja">
        {/* eslint-disable-next-line smarthr/a11y-form-control-in-form */}
        <FormControl label="Description" errorMessages="Required field">
          <RichTextEditor />
        </FormControl>
      </IntlProvider>,
    )
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Required field')).toBeInTheDocument()
  })

  it('has aria-pressed on toggle buttons', async () => {
    render(<RichTextEditor features={['bold']} />, { wrapper: Wrapper })
    await waitFor(() => {
      expect(screen.getByRole('toolbar')).toBeInTheDocument()
    })
    const boldButton = screen.getByLabelText('太字')
    expect(boldButton).toHaveAttribute('aria-pressed', 'false')
  })
})
