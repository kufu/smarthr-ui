import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { type FC, useState } from 'react'

import { IntlProvider } from '../../../intl'
import { Button } from '../../Button'

import { ControlledActionDialog } from './ControlledActionDialog'

describe('ControlledActionDialog', () => {
  const DialogTemplate: FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    return (
      <IntlProvider locale="ja">
        <Button onClick={() => setIsOpen(true)}>ControlledActionDialog</Button>
        <ControlledActionDialog
          isOpen={isOpen}
          heading="ControlledActionDialog"
          actionText="保存"
          onClickClose={() => setIsOpen(false)}
          onClickAction={(_, { close }) => {
            close()
          }}
        >
          <p>ControlledActionDialog の本文です。</p>
        </ControlledActionDialog>
      </IntlProvider>
    )
  }
  it('ダイアログが開閉できること', async () => {
    render(<DialogTemplate />)

    expect(screen.queryByRole('dialog', { name: 'ControlledActionDialog' })).toBeNull()
    await userEvent.tab()
    await userEvent.keyboard('{enter}')
    expect(screen.getByRole('dialog', { name: 'ControlledActionDialog' })).toBeVisible()

    await userEvent.tab({ shift: true })
    await userEvent.keyboard('{ }')
    await waitFor(
      () => {
        expect(screen.queryByRole('dialog', { name: 'ControlledActionDialog' })).toBeNull()
      },
      { timeout: 1000 },
    )

    // ダイアログを閉じた後、トリガがフォーカスされることを確認
    expect(screen.getByRole('button', { name: 'ControlledActionDialog' })).toHaveFocus()
  })
})
