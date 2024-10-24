import { userEvent } from '@storybook/test'
import { act, render, screen, waitFor } from '@testing-library/react'
import React, { useState } from 'react'

import { Button } from '../../Button'

import { ActionDialog } from './ActionDialog'

describe('ActionDialog', () => {
  const DialogTemplate: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    return (
      <>
        <Button
          onClick={() => setIsOpen(true)}
          aria-haspopup="dialog"
          aria-controls="dialog-action"
          // 別のスタッキングコンテキストがダイアログ背景よりも上に来ないことを確認するための記述
          style={{ position: 'relative', zIndex: 21 }}
        >
          ActionDialog
        </Button>
        <ActionDialog
          isOpen={isOpen}
          title="ActionDialog"
          subtitle="副題"
          actionText="保存"
          decorators={{ closeButtonLabel: (txt) => `cancel.(${txt})` }}
          onClickClose={() => setIsOpen(false)}
          id="dialog-action"
          width="40em"
          subActionArea={<Button>サブアクション</Button>}
          onClickAction={(closeDialog) => {
            closeDialog()
          }}
        >
          <p>ActionDialog の本文です。</p>
        </ActionDialog>
      </>
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
