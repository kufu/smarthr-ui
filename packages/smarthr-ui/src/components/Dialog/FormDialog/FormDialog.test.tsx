import { userEvent } from '@storybook/test'
import { act, render, screen, waitFor } from '@testing-library/react'
import React, { useRef, useState } from 'react'

import { Button } from '../../Button'
import { FormControl } from '../../FormControl'
import { Input } from '../../Input'
import { Text } from '../../Text'

import { FormDialog } from './FormDialog'

describe('FormDialog', () => {
  const DialogTemplate: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    return (
      <>
        <Button
          onClick={() => setIsOpen(true)}
          aria-haspopup="dialog"
          aria-controls="dialog-form"
          // 別のスタッキングコンテキストがダイアログ背景よりも上に来ないことを確認するための記述
          style={{ position: 'relative', zIndex: 21 }}
        >
          FormDialog
        </Button>
        <FormDialog
          isOpen={isOpen}
          title="FormDialog"
          subtitle="副題"
          actionText="保存"
          decorators={{ closeButtonLabel: (txt) => `cancel.(${txt})` }}
          onSubmit={(closeDialog, e) => {
            closeDialog()
          }}
          onClickClose={() => {
            setIsOpen(false)
          }}
          id="dialog-form"
          width="40em"
          subActionArea={<Button>サブアクション</Button>}
        >
          <Text>ダイアログの中身です</Text>
        </FormDialog>
      </>
    )
  }
  it('ダイアログが開閉できること', async () => {
    render(<DialogTemplate />)

    expect(screen.queryByRole('dialog', { name: 'FormDialog' })).toBeNull()
    await act(() => userEvent.tab())
    await act(() => userEvent.keyboard('{enter}'))
    expect(screen.getByRole('dialog', { name: 'FormDialog' })).toBeVisible()

    await act(() => userEvent.tab({ shift: true }))
    await act(() => userEvent.keyboard('{ }'))
    await waitFor(
      () => {
        expect(screen.queryByRole('dialog', { name: 'FormDialog' })).toBeNull()
      },
      { timeout: 1000 },
    )

    // ダイアログを閉じた後、トリガがフォーカスされることを確認
    expect(screen.getByRole('button', { name: 'FormDialog' })).toHaveFocus()
  })

  const DialogTemplateWithFocusTrap: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const openedFocusRef = useRef<HTMLInputElement>(null)
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>開いた状態で DOM に投入</Button>
        {isOpen && (
          <FormDialog
            isOpen
            title="開いた状態で投入されたダイアログ"
            actionText="実行"
            onSubmit={(closeDialog) => {
              closeDialog()
            }}
            onClickClose={() => {
              setIsOpen(false)
            }}
            decorators={{ closeButtonLabel: (txt) => `close.(${txt})` }}
            firstFocusTarget={openedFocusRef}
          >
            <FormControl
              title={
                <>
                  <code>isOpen=true</code> の状態で DOM に投入した場合のダイアログ
                </>
              }
            >
              <Input ref={openedFocusRef} name="opened_dialog_focus_target" />
            </FormControl>
          </FormDialog>
        )}
      </>
    )
  }
  it('開いた状態で DOM に投入されたダイアログにフォーカスが移動すること', async () => {
    render(<DialogTemplateWithFocusTrap />)

    expect(screen.queryByRole('dialog', { name: '開いた状態で投入されたダイアログ' })).toBeNull()
    await act(() => userEvent.tab())
    await act(() => userEvent.keyboard('{enter}'))
    expect(screen.getByRole('dialog', { name: '開いた状態で投入されたダイアログ' })).toBeVisible()

    expect(
      screen.getByRole('textbox', { name: 'isOpen=true の状態で DOM に投入した場合のダイアログ' }),
    ).toHaveFocus()

    await act(() => userEvent.tab())
    await act(() => userEvent.keyboard('{ }'))
    await waitFor(
      () => {
        expect(screen.queryByRole('dialog', { name: 'FormDialog' })).toBeNull()
      },
      { timeout: 1000 },
    )

    // ダイアログを閉じた後、トリガがフォーカスされることを確認
    expect(screen.getByRole('button', { name: '開いた状態で DOM に投入' })).toHaveFocus()
  })
})
