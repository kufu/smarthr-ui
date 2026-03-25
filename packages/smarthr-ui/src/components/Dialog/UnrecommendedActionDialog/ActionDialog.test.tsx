import { act, render, screen, waitFor } from '@testing-library/react'
import { type FC, useState } from 'react'
import { userEvent } from 'storybook/test'

import { IntlProvider } from '../../../intl'
import { Button } from '../../Button'

import { UnrecommendedActionDialog } from './UnrecommendedActionDialog'

describe('UnrecommendedActionDialog', () => {
  const DialogTemplate: FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    return (
      <IntlProvider locale="ja">
        <Button onClick={() => setIsOpen(true)}>UnrecommendedActionDialog</Button>
        <UnrecommendedActionDialog
          isOpen={isOpen}
          heading="UnrecommendedActionDialog"
          actionText="保存"
          onClickClose={() => setIsOpen(false)}
          onClickAction={(_, { close }) => {
            close()
          }}
        >
          <p>UnrecommendedActionDialog の本文です。</p>
        </UnrecommendedActionDialog>
      </IntlProvider>
    )
  }
  it('ダイアログが開閉できること', async () => {
    render(<DialogTemplate />)

    expect(screen.queryByRole('dialog', { name: 'UnrecommendedActionDialog' })).toBeNull()
    await act(() => userEvent.tab())
    await act(() => userEvent.keyboard('{enter}'))
    expect(screen.getByRole('dialog', { name: 'UnrecommendedActionDialog' })).toBeVisible()

    await act(() => userEvent.tab({ shift: true }))
    await act(() => userEvent.keyboard('{ }'))
    await waitFor(
      () => {
        expect(screen.queryByRole('dialog', { name: 'UnrecommendedActionDialog' })).toBeNull()
      },
      { timeout: 1000 },
    )

    // ダイアログを閉じた後、トリガがフォーカスされることを確認
    expect(screen.getByRole('button', { name: 'UnrecommendedActionDialog' })).toHaveFocus()
  })
})
