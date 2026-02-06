import { act, render, screen, waitFor } from '@testing-library/react'
import { type FC, useState } from 'react'
import { userEvent } from 'storybook/test'

import { IntlProvider } from '../../../intl'
import { Button } from '../../Button'

import { MessageDialog } from './MessageDialog'

describe('MessageDialog', () => {
  const DialogTemplate: FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    return (
      <IntlProvider locale="ja">
        <Button onClick={() => setIsOpen(true)}>MessageDialog</Button>
        <MessageDialog isOpen={isOpen} title="MessageDialog" onClickClose={() => setIsOpen(false)}>
          <p>説明です</p>
        </MessageDialog>
      </IntlProvider>
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
