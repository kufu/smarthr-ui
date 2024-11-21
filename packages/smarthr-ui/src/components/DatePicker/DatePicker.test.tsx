import { userEvent } from '@storybook/test'
import { render, screen } from '@testing-library/react'
import React, { act } from 'react'

import { FormControl } from '../FormControl'

import { DatePicker } from './DatePicker'

describe('DatePicker', () => {
  beforeEach(() => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0)
      return 0
    })
  })

  it('カレンダーから日付を選択することができる', async () => {
    render(
      <form>
        <FormControl title="DatePicker">
          <DatePicker value="2024-09-25" name="date" onChangeDate={vi.fn()} />
        </FormControl>
      </form>,
    )
    const textbox = screen.getByRole('textbox', { name: 'DatePicker' })

    // カレンダーを開く
    act(() => textbox.click())

    // カレンダーが開かれていることを確認
    expect(textbox).toHaveProperty('ariaExpanded', 'true')

    // 日にちを選択する
    act(() => screen.getByRole('button', { name: '4' }).click())

    // 日付がテキストボックスに入ることを確認
    expect(textbox).toHaveProperty('value', '2024/09/04')

    // 選択後はカレンダーが閉じられていることを確認
    expect(textbox).toHaveProperty('ariaExpanded', 'false')
  })

  it('フォーカスを失うときにテキストボックスの内容がフォーマットされること', async () => {
    render(
      <form>
        <FormControl title="DatePicker">
          <DatePicker name="date" onChangeDate={vi.fn()} />
        </FormControl>
      </form>,
    )
    const textbox = screen.getByRole('textbox', { name: 'DatePicker' })
    await act(() => userEvent.type(textbox, '平成4年5月29日{tab}'))
    expect(textbox).toHaveProperty('value', '1992/05/29')
  })
})
