import { act, render, screen, waitFor } from '@testing-library/react'
import { type FC, useState } from 'react'
import { userEvent } from 'storybook/test'

import { IntlProvider } from '../../../intl'
import { Button } from '../../Button'

import { ActionDialog } from './ActionDialog'

describe('ActionDialog', () => {
  const DialogTemplate: FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    return (
      <IntlProvider locale="ja">
        <Button onClick={() => setIsOpen(true)}>ActionDialog</Button>
        <ActionDialog
          isOpen={isOpen}
          heading="ActionDialog"
          actionText="保存"
          onClickClose={() => setIsOpen(false)}
          onClickAction={(closeDialog) => {
            closeDialog()
          }}
        >
          <p>ActionDialog の本文です。</p>
        </ActionDialog>
      </IntlProvider>
    )
  }
  it('ダイアログが開閉できること', async () => {
    render(<DialogTemplate />)

    expect(screen.queryByRole('dialog', { name: 'ActionDialog' })).toBeNull()
    await act(() => userEvent.tab())
    await act(() => userEvent.keyboard('{enter}'))
    expect(screen.getByRole('dialog', { name: 'ActionDialog' })).toBeVisible()

    await act(() => userEvent.tab({ shift: true }))
    await act(() => userEvent.keyboard('{ }'))
    await waitFor(
      () => {
        expect(screen.queryByRole('dialog', { name: 'ActionDialog' })).toBeNull()
      },
      { timeout: 1000 },
    )

    // ダイアログを閉じた後、トリガがフォーカスされることを確認
    expect(screen.getByRole('button', { name: 'ActionDialog' })).toHaveFocus()
  })
})
