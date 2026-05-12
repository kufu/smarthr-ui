import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { type FC, useState } from 'react'

import { IntlProvider } from '../../../intl'
import { Button } from '../../Button'

import { ControlledMessageDialog } from './ControlledMessageDialog'

describe('ControlledMessageDialog', () => {
  const DialogTemplate: FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    return (
      <IntlProvider locale="ja">
        <Button onClick={() => setIsOpen(true)}>ControlledMessageDialog</Button>
        <ControlledMessageDialog
          isOpen={isOpen}
          heading="ControlledMessageDialog"
          onClickClose={() => setIsOpen(false)}
        >
          <p>説明です</p>
        </ControlledMessageDialog>
      </IntlProvider>
    )
  }
  it('ダイアログが開閉できること', async () => {
    render(<DialogTemplate />)

    expect(screen.queryByRole('dialog', { name: 'ControlledMessageDialog' })).toBeNull()
    await userEvent.tab()
    await userEvent.keyboard('{enter}')
    expect(screen.getByRole('dialog', { name: 'ControlledMessageDialog' })).toBeVisible()

    await userEvent.tab({ shift: true })
    await userEvent.keyboard('{ }')
    await waitFor(
      () => {
        expect(screen.queryByRole('dialog', { name: 'ControlledMessageDialog' })).toBeNull()
      },
      { timeout: 1000 },
    )

    // ダイアログを閉じた後、トリガがフォーカスされることを確認
    expect(screen.getByRole('button', { name: 'ControlledMessageDialog' })).toHaveFocus()
  })
})
