import { userEvent } from '@storybook/test'
import { act, render, screen, waitFor } from '@testing-library/react'
import React, { useState } from 'react'

import { Button } from '../../Button'

import { MessageDialog } from './MessageDialog'

describe('MessageDialog', () => {
  const DialogTemplate: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>MessageDialog</Button>
        <MessageDialog
          isOpen={isOpen}
          title="MessageDialog"
          description={<p>説明です</p>}
          onClickClose={() => setIsOpen(false)}
        />
      </>
    )
  }
  it('ダイアログが開閉できること', async () => {
    render(<DialogTemplate />)

    expect(screen.queryByRole('dialog', { name: 'MessageDialog' })).toBeNull()
    await act(() => userEvent.tab())
    await act(() => userEvent.keyboard('{enter}'))
    expect(screen.getByRole('dialog', { name: 'MessageDialog' })).toBeVisible()

    await act(() => userEvent.tab({ shift: true }))
    await act(() => userEvent.keyboard('{ }'))
    await waitFor(
      () => {
        expect(screen.queryByRole('dialog', { name: 'MessageDialog' })).toBeNull()
      },
      { timeout: 1000 },
    )

    // ダイアログを閉じた後、トリガがフォーカスされることを確認
    expect(screen.getByRole('button', { name: 'MessageDialog' })).toHaveFocus()
  })
})
