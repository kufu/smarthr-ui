import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { type FC, useState } from 'react'

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

  it('初回マウント時にisOpenがtrueの場合も、正しく中央寄せされること', () => {
    // HINT: jsdomにはレイアウトが無いため、DOMに接続済みの要素にのみサイズを持たせてrectを返す。
    // portal containerがdocument.bodyへappendされる前に計測すると0が返り、中央寄せがずれる不具合の再現に使う
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      const size = this.isConnected ? { width: 200, height: 100 } : { width: 0, height: 0 }
      return { ...size, top: 0, left: 0, right: 0, bottom: 0, x: 0, y: 0, toJSON: () => {} }
    })

    render(
      <IntlProvider locale="ja">
        <ModelessDialog isOpen onClickClose={() => {}} heading="初回マウント表示">
          <p>ダイアログの中身</p>
        </ModelessDialog>
      </IntlProvider>,
    )

    const dialog = screen.getByRole('dialog', { name: '初回マウント表示' })

    expect(dialog.style.top).toBe(`${window.innerHeight / 2 - 50}px`)
    expect(dialog.style.left).toBe(`${window.innerWidth / 2 - 100}px`)
  })
})
