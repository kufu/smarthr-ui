import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { type FC, useState } from 'react'

import { IntlProvider } from '../../../intl'
import { Button } from '../../Button'

import { ControlledActionDialog } from './ControlledActionDialog'

const waitForAnimationFrame = () => new Promise((resolve) => requestAnimationFrame(resolve))

describe('ControlledActionDialog', () => {
  const DialogTemplate: FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    return (
      <IntlProvider locale="ja">
        <Button onClick={() => setIsOpen(true)}>ControlledActionDialog</Button>
        <ControlledActionDialog
          isOpen={isOpen}
          onClickClose={() => setIsOpen(false)}
          onClickAction={(_, { close }) => {
            close()
          }}
          heading="ControlledActionDialog"
          actionButton="保存"
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

    // FocusTrap はカスケード更新完了後の requestAnimationFrame でフォーカスするため、フレームが進むのを待つ
    await waitForAnimationFrame()

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

  it('閉じるボタンのクリックでonClickCloseに実際のMouseEventが渡されること', async () => {
    const handleClickClose = vi.fn()
    render(
      <IntlProvider locale="ja">
        <ControlledActionDialog
          isOpen
          onClickClose={handleClickClose}
          onClickAction={(_, { close }) => close()}
          heading="ControlledActionDialog"
          actionButton="保存"
        >
          <p>本文</p>
        </ControlledActionDialog>
      </IntlProvider>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'キャンセル' }))

    expect(handleClickClose).toHaveBeenCalledTimes(1)
    expect(handleClickClose.mock.calls[0][0].nativeEvent).toBeInstanceOf(MouseEvent)
  })

  it('Escapeキー押下でonClickCloseに実際のKeyboardEventが渡されること', async () => {
    const handleClickClose = vi.fn()
    render(
      <IntlProvider locale="ja">
        <ControlledActionDialog
          isOpen
          onClickClose={handleClickClose}
          onClickAction={(_, { close }) => close()}
          heading="ControlledActionDialog"
          actionButton="保存"
        >
          <p>本文</p>
        </ControlledActionDialog>
      </IntlProvider>,
    )

    await userEvent.keyboard('{Escape}')

    expect(handleClickClose).toHaveBeenCalledTimes(1)
    const receivedEvent = handleClickClose.mock.calls[0][0]
    expect(receivedEvent).toBeInstanceOf(KeyboardEvent)
    expect(receivedEvent.key).toBe('Escape')
  })
})
