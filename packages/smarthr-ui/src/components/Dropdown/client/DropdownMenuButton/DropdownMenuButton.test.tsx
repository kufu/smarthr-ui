import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { act } from 'react'

import { IntlProvider } from '../../../../intl'
import { Button } from '../../../Button'
import { MessageDialog, RemoteDialogTrigger } from '../../../Dialog'
import { Input } from '../../../Input'

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

  describe('キーボード操作', () => {
    const template = (
      <IntlProvider locale="ja">
        <DropdownMenuButton trigger="その他の操作">
          <Button>操作1</Button>
          <Button>操作2</Button>
        </DropdownMenuButton>
        <Input name="outside" aria-label="メニュー外の入力欄" />
        <Button>次の操作</Button>
      </IntlProvider>
    )

    it.each([
      { key: 'Tab', role: 'button', name: '次の操作' },
      { key: 'ArrowRight', role: 'textbox', name: 'メニュー外の入力欄' },
    ])('メニューを開いても、入力欄の $key の操作を奪わない', async ({ key, role, name }) => {
      const user = userEvent.setup()
      render(template)

      await user.click(screen.getByRole('button', { name: /その他の操作/ }))
      await waitForAnimationFrame()
      expect(screen.getByRole('menu')).toBeInTheDocument()
      act(() => screen.getByRole('textbox', { name: 'メニュー外の入力欄' }).focus())

      await user.keyboard(`[${key}]`)

      expect(screen.getByRole(role, { name })).toHaveFocus()
    })

    it.each(['preventDefault', 'stopPropagation'] as const)(
      'トリガーの onKeyDown で %s すると、矢印キーでメニュー項目へフォーカスを移さない',
      async (method) => {
        const user = userEvent.setup()
        render(
          <IntlProvider locale="ja">
            <DropdownMenuButton onKeyDown={(e) => e[method]()} trigger="その他の操作">
              <Button>操作1</Button>
            </DropdownMenuButton>
          </IntlProvider>,
        )

        const trigger = screen.getByRole('button', { name: /その他の操作/ })
        await user.click(trigger)
        await waitForAnimationFrame()
        act(() => trigger.focus())

        await user.keyboard('[ArrowDown]')

        expect(trigger).toHaveFocus()
      },
    )

    it('開いたメニュー内で項目を移動し、最後の項目からの Tab で閉じる', async () => {
      const user = userEvent.setup()
      render(template)

      const trigger = screen.getByRole('button', { name: /その他の操作/ })
      await user.click(trigger)
      await waitForAnimationFrame()

      await user.tab()
      expect(screen.getByRole('menuitem', { name: '操作1' })).toHaveFocus()

      act(() => trigger.focus())
      await user.keyboard('[ArrowDown]')
      expect(screen.getByRole('menuitem', { name: '操作1' })).toHaveFocus()
      await user.keyboard('[ArrowDown]')
      expect(screen.getByRole('menuitem', { name: '操作2' })).toHaveFocus()

      await user.tab()
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
      expect(trigger).toHaveFocus()
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
