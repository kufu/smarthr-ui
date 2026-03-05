import { act, render, screen, waitFor } from '@testing-library/react'
import { type FC, useState } from 'react'
import { userEvent } from 'storybook/test'

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
          heading="座標指定表示"
          onClickClose={() => setIsOpen(false)}
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
    await act(() => userEvent.tab())
    await act(() => userEvent.keyboard('{enter}'))
    expect(screen.getByRole('dialog', { name: '座標指定表示' })).toBeVisible()

    // 裏側をクリックしてもダイアログが閉じないこと
    await act(() => userEvent.click(document.body))
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
})
