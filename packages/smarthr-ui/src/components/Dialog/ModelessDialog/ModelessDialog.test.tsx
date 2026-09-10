import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { type FC, useState } from 'react'

import { EnvironmentProvider } from '../../../hooks/client/useEnvironment'
import { IntlProvider } from '../../../intl'
import { Button } from '../../Button'

import { ModelessDialog } from './ModelessDialog'

describe('ModelessDialog', () => {
  const DialogTemplate: FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    return (
      <IntlProvider locale="ja">
        <Button onClick={() => setIsOpen(true)}>ModelessDialog</Button>
        <ModelessDialog
          isOpen={isOpen}
          onClickClose={() => setIsOpen(false)}
          heading="座標指定表示"
        >
          <p>ダイアログの中身</p>
        </ModelessDialog>
      </IntlProvider>
    )
  }
  it('ダイアログが開閉できること', async () => {
    render(<DialogTemplate />)

    // トリガ押下でダイアログが開くこと
    expect(screen.queryByRole('dialog', { name: 'ModelessDialog' })).toBeNull()
    await userEvent.tab()
    await userEvent.keyboard('{enter}')
    expect(screen.getByRole('dialog', { name: '座標指定表示' })).toBeVisible()

    // 裏側をクリックしてもダイアログが閉じないこと
    await userEvent.click(document.body)
    await waitFor(
      () => {
        expect(screen.getByRole('dialog', { name: '座標指定表示' })).toBeVisible()
      },
      { timeout: 1000 },
    )

    // 閉じるボタン押下でダイアログが閉じること
    await act(() => screen.getByRole('button', { name: '閉じる' }).click())
    await waitFor(
      () => {
        expect(screen.queryByRole('dialog', { name: '座標指定表示' })).toBeNull()
      },
      { timeout: 1000 },
    )
  })

  it('モバイル環境ではMessageDialogとして表示されること', async () => {
    const onClickClose = vi.fn()

    render(
      <EnvironmentProvider environment={{ mobile: true }}>
        <IntlProvider locale="ja">
          <ModelessDialog
            isOpen
            top={10}
            left={10}
            right={10}
            bottom={10}
            resizable
            height="10em"
            onClickClose={onClickClose}
            heading="モバイルダイアログ"
            footer="モードレス用フッター"
          >
            <p>ダイアログの中身</p>
          </ModelessDialog>
        </IntlProvider>
      </EnvironmentProvider>,
    )

    const dialog = screen.getByRole('dialog', { name: 'モバイルダイアログ' })

    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).not.toHaveClass('smarthr-ui-ModelessDialog')
    expect(dialog).not.toHaveStyle({ height: '10em', top: '10px', left: '10px' })
    expect(screen.queryByText('モードレス用フッター')).toBeNull()

    await userEvent.click(screen.getByRole('button', { name: '閉じる' }))

    expect(onClickClose).toHaveBeenCalledWith(expect.objectContaining({ type: 'click' }))

    onClickClose.mockClear()
    await userEvent.keyboard('{Escape}')

    expect(onClickClose).not.toHaveBeenCalled()
  })
})
