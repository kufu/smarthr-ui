import { act, render, screen, waitFor } from '@testing-library/react'
import { type FC, useRef, useState } from 'react'
import { userEvent } from 'storybook/test'

import { IntlProvider } from '../../../intl'
import { Button } from '../../Button'
import { FormControl } from '../../FormControl'
import { Input } from '../../Input'
import { Text } from '../../Text'

import { UnrecommendedFormDialog } from './UnrecommendedFormDialog'

describe('UnrecommendedFormDialog', () => {
  const DialogTemplate: FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    return (
      <IntlProvider locale="ja">
        <Button onClick={() => setIsOpen(true)}>UnrecommendedFormDialog</Button>
        <UnrecommendedFormDialog
          isOpen={isOpen}
          heading="UnrecommendedFormDialog"
          actionText="保存"
          onSubmit={(_, { close }) => {
            close()
          }}
          onClickClose={() => {
            setIsOpen(false)
          }}
        >
          <Text>ダイアログの中身です</Text>
        </UnrecommendedFormDialog>
      </IntlProvider>
    )
  }
  it('ダイアログが開閉できること', async () => {
    render(<DialogTemplate />)

    expect(screen.queryByRole('dialog', { name: 'UnrecommendedFormDialog' })).toBeNull()
    await act(() => userEvent.tab())
    await act(() => userEvent.keyboard('{enter}'))
    expect(screen.getByRole('dialog', { name: 'UnrecommendedFormDialog' })).toBeVisible()

    await act(() => userEvent.tab({ shift: true }))
    await act(() => userEvent.keyboard('{ }'))
    await waitFor(
      () => {
        expect(screen.queryByRole('dialog', { name: 'UnrecommendedFormDialog' })).toBeNull()
      },
      { timeout: 1000 },
    )

    // ダイアログを閉じた後、トリガがフォーカスされることを確認
    expect(screen.getByRole('button', { name: 'UnrecommendedFormDialog' })).toHaveFocus()
  })

  const DialogTemplateWithFocusTrap: FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const openedFocusRef = useRef<HTMLInputElement>(null)
    return (
      <IntlProvider locale="ja">
        <Button onClick={() => setIsOpen(true)}>開いた状態で DOM に投入</Button>
        {isOpen && (
          <UnrecommendedFormDialog
            isOpen
            heading="開いた状態で投入されたダイアログ"
            actionText="実行"
            onSubmit={(_, { close }) => {
              close()
            }}
            onClickClose={() => {
              setIsOpen(false)
            }}
            firstFocusTarget={openedFocusRef}
          >
            <FormControl
              label={
                <>
                  <code>isOpen=true</code> の状態で DOM に投入した場合のダイアログ
                </>
              }
            >
              <Input ref={openedFocusRef} name="opened_dialog_focus_target" />
            </FormControl>
          </UnrecommendedFormDialog>
        )}
      </IntlProvider>
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
        expect(screen.queryByRole('dialog', { name: 'UnrecommendedFormDialog' })).toBeNull()
      },
      { timeout: 1000 },
    )

    // ダイアログを閉じた後、トリガがフォーカスされることを確認
    expect(screen.getByRole('button', { name: '開いた状態で DOM に投入' })).toHaveFocus()
  })
})
