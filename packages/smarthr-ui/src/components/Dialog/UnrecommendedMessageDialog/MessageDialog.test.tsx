import { act, render, screen, waitFor } from '@testing-library/react'
import { type FC, useState } from 'react'
import { userEvent } from 'storybook/test'

import { IntlProvider } from '../../../intl'
import { Button } from '../../Button'

import { UnrecommendedMessageDialog } from './UnrecommendedMessageDialog'

describe('UnrecommendedMessageDialog', () => {
  const DialogTemplate: FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    return (
      <IntlProvider locale="ja">
        <Button onClick={() => setIsOpen(true)}>UnrecommendedMessageDialog</Button>
        <UnrecommendedMessageDialog
          isOpen={isOpen}
          heading="UnrecommendedMessageDialog"
          onClickClose={() => setIsOpen(false)}
        >
          <p>説明です</p>
        </UnrecommendedMessageDialog>
      </IntlProvider>
    )
  }
  it('ダイアログが開閉できること', async () => {
    render(<DialogTemplate />)

    expect(screen.queryByRole('dialog', { name: 'UnrecommendedMessageDialog' })).toBeNull()
    await act(() => userEvent.tab())
    await act(() => userEvent.keyboard('{enter}'))
    expect(screen.getByRole('dialog', { name: 'UnrecommendedMessageDialog' })).toBeVisible()

    await act(() => userEvent.tab({ shift: true }))
    await act(() => userEvent.keyboard('{ }'))
    await waitFor(
      () => {
        expect(screen.queryByRole('dialog', { name: 'UnrecommendedMessageDialog' })).toBeNull()
      },
      { timeout: 1000 },
    )

    // ダイアログを閉じた後、トリガがフォーカスされることを確認
    expect(screen.getByRole('button', { name: 'UnrecommendedMessageDialog' })).toHaveFocus()
  })
})
