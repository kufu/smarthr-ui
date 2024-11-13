import { userEvent } from '@storybook/test'
import { act, render, screen, waitFor } from '@testing-library/react'
import React, { useState } from 'react'

import { Button } from '../Button'
import { Heading } from '../Heading'

import { ModelessDialog } from './ModelessDialog'

describe('ModelessDialog', () => {
  const DialogTemplate: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>ModelessDialog</Button>
        <ModelessDialog
          isOpen={isOpen}
          // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
          header={<Heading tag="h2">座標指定表示</Heading>}
          onClickClose={() => setIsOpen(false)}
        >
          <p>ダイアログの中身</p>
        </ModelessDialog>
      </>
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
