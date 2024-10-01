import { render, screen } from '@testing-library/react'
import React, { act } from 'react'

import { Calendar } from './Calendar'

describe('Calendar', () => {
  it('value で指定した日付が選択されていること', () => {
    render(<Calendar value={new Date(2020, 0, 15)} onSelectDate={vi.fn()} />)

    expect(screen.queryByText('2020年1月')).toBeTruthy()
    expect(screen.getByRole('button', { name: '15' }).getAttribute('aria-pressed')).toBe('true')
  })

  it('前の月に切り替えることができる', () => {
    render(<Calendar value={new Date(2020, 1, 15)} onSelectDate={vi.fn()} />)

    act(() => screen.getByRole('button', { name: '前の月へ' }).click())
    expect(screen.queryByText('2020年1月')).toBeTruthy()

    act(() => screen.getByRole('button', { name: '前の月へ' }).click())
    expect(screen.queryByText('2019年12月')).toBeTruthy()
  })

  it('次の月に切り替えることができる', () => {
    render(<Calendar value={new Date(2020, 10, 15)} onSelectDate={vi.fn()} />)

    act(() => screen.getByRole('button', { name: '次の月へ' }).click())
    expect(screen.queryByText('2020年12月')).toBeTruthy()

    act(() => screen.getByRole('button', { name: '次の月へ' }).click())
    expect(screen.queryByText('2021年1月')).toBeTruthy()
  })

  it('年を切り替えることができる', () => {
    render(<Calendar value={new Date(2020, 10, 15)} onSelectDate={vi.fn()} />)

    act(() => screen.getByRole('button', { name: '年を選択する' }).click())
    act(() => screen.getByRole('button', { name: '2024' }).click())
    expect(screen.queryByText('2024年11月')).toBeTruthy()
  })

  it('日にちを選択すると、onSelectDate が発火すること', () => {
    const onSelectDate = vi.fn()
    render(<Calendar value={new Date(2021, 8, 20)} onSelectDate={onSelectDate} />)
    act(() => screen.getByRole('button', { name: '10' }).click())
    expect(onSelectDate).toHaveBeenCalledWith(expect.anything(), new Date(2021, 8, 10))
  })
})
