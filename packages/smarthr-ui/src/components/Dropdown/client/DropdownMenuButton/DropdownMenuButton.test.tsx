import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { act } from 'react'

import { IntlProvider } from '../../../../intl'
import { Button } from '../../../Button'
import { MessageDialog, RemoteDialogTrigger } from '../../../Dialog'

import { DropdownMenuButton } from './DropdownMenuButton'

// DropdownContent は requestAnimationFrame 経由でフォーカスを当てる
const waitForAnimationFrame = () =>
  act(async () => {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve())
    })
  })

describe('DropdownMenuButton', () => {
  describe('trigger', () => {
    it('文字列を直接指定した場合、トリガーボタンにラベルが表示される', () => {
      render(
        <IntlProvider locale="ja">
          <DropdownMenuButton trigger="その他の操作">
            <Button>操作1</Button>
          </DropdownMenuButton>
        </IntlProvider>,
      )

      expect(screen.getByRole('button', { name: /その他の操作/ })).toBeInTheDocument()
    })

    it('オブジェクト形式(text)で指定した場合、トリガーボタンにラベルが表示される', () => {
      render(
        <IntlProvider locale="ja">
          <DropdownMenuButton trigger={{ text: 'その他の操作', size: 'S' }}>
            <Button>操作1</Button>
          </DropdownMenuButton>
        </IntlProvider>,
      )

      expect(screen.getByRole('button', { name: /その他の操作/ })).toBeInTheDocument()
    })
  })

  describe('メニュー項目にRemoteDialogTriggerがある場合', () => {
    const template = (
      <IntlProvider locale="ja">
        <DropdownMenuButton trigger="その他の操作">
          <RemoteDialogTrigger targetId="remote-dialog">
            <Button>ダイアログを開く</Button>
          </RemoteDialogTrigger>
        </DropdownMenuButton>
        <MessageDialog id="remote-dialog" heading="リモートダイアログ">
          ダイアログの内容
        </MessageDialog>
      </IntlProvider>
    )

    it('クリックするとダイアログが開き、メニュー自体も閉じること', async () => {
      const user = userEvent.setup()
      render(template)

      await user.click(screen.getByRole('button', { name: /その他の操作/ }))
      await waitForAnimationFrame()
      expect(screen.getByRole('button', { name: /その他の操作/ })).toHaveAttribute(
        'aria-expanded',
        'true',
      )

      await user.click(screen.getByRole('menuitem', { name: 'ダイアログを開く' }))

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      // RemoteDialogTriggerはDropdownCloserより先にキャプチャフェーズで処理されるため、
      // ダイアログが開くと同時にメニュー自体も閉じる
      expect(screen.getByRole('button', { name: /その他の操作/ })).toHaveAttribute(
        'aria-expanded',
        'false',
      )
    })
  })
})
