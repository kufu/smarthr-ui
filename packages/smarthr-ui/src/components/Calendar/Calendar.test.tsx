import { render, screen } from '@testing-library/react'
import { act } from 'react'

import { IntlProvider } from '../../intl'

import { Calendar } from './Calendar'

import type * as locales from '../../intl/locales'

describe('Calendar', () => {
  const renderWithIntl = (component: React.ReactElement, locale: keyof typeof locales = 'ja') =>
    render(<IntlProvider locale={locale}>{component}</IntlProvider>)

  it('value で指定した日付が選択されていること', () => {
    renderWithIntl(<Calendar value={new Date(2020, 0, 15)} onSelectDate={vi.fn()} />)

    expect(screen.queryByText('2020年1月')).toBeTruthy()
    expect(screen.getByRole('button', { name: '15' }).getAttribute('aria-pressed')).toBe('true')
  })

  it('前の月に切り替えることができる', () => {
    renderWithIntl(<Calendar value={new Date(2020, 1, 15)} onSelectDate={vi.fn()} />)

    act(() => screen.getByRole('button', { name: '前の月へ' }).click())
    expect(screen.queryByText('2020年1月')).toBeTruthy()

    act(() => screen.getByRole('button', { name: '前の月へ' }).click())
    expect(screen.queryByText('2019年12月')).toBeTruthy()
  })

  it('次の月に切り替えることができる', () => {
    renderWithIntl(<Calendar value={new Date(2020, 10, 15)} onSelectDate={vi.fn()} />)

    act(() => screen.getByRole('button', { name: '次の月へ' }).click())
    expect(screen.queryByText('2020年12月')).toBeTruthy()

    act(() => screen.getByRole('button', { name: '次の月へ' }).click())
    expect(screen.queryByText('2021年1月')).toBeTruthy()
  })

  it('年を切り替えることができる', () => {
    renderWithIntl(<Calendar value={new Date(2020, 10, 15)} onSelectDate={vi.fn()} />)

    act(() => screen.getByRole('button', { name: '年を選択する' }).click())
    act(() => screen.getByRole('button', { name: '2024' }).click())
    expect(screen.queryByText('2024年11月')).toBeTruthy()
  })

  it('日にちを選択すると、onSelectDate が発火すること', () => {
    const onSelectDate = vi.fn()
    renderWithIntl(<Calendar value={new Date(2021, 8, 20)} onSelectDate={onSelectDate} />)
    act(() => screen.getByRole('button', { name: '10' }).click())
    expect(onSelectDate).toHaveBeenCalledWith(expect.anything(), new Date(2021, 8, 10))
  })

  it('年選択ボタンのアクセシビリティが正しいこと', () => {
    renderWithIntl(<Calendar value={new Date(2020, 0, 15)} onSelectDate={vi.fn()} />)

    const yearSelectButton = screen.getByRole('button', { name: /年を選択/ })
    expect(yearSelectButton.getAttribute('aria-expanded')).toBe('false')

    act(() => yearSelectButton.click())
    expect(yearSelectButton.getAttribute('aria-expanded')).toBe('true')
  })

  describe('ロケール別の日付配置', () => {
    it('日付が正しい週開始日に従って配置されること', () => {
      // 2020年9月1日は火曜日をテストケースとして使用
      const september1st2020 = new Date(2020, 8, 1) // 2020年9月1日（火曜日）
      const targetDateText = '1' // 9月1日を探す

      // 日曜日開始のロケール（英語）
      const { container: enContainer } = renderWithIntl(
        <Calendar value={september1st2020} onSelectDate={vi.fn()} />,
        'en-us',
      )

      // 月曜日開始のロケール（インドネシア語）
      const { container: idContainer } = renderWithIntl(
        <Calendar value={september1st2020} onSelectDate={vi.fn()} />,
        'id-id',
      )

      // 英語（日曜日開始）: 火曜日は3番目の列（index 2）に表示される
      const enFirstRow = enContainer.querySelector('tbody tr')
      const enCells = Array.from(enFirstRow!.querySelectorAll('td'))
      const enDateOneCell = enCells.find((cell) => cell.textContent?.includes(targetDateText))
      const enPositionIndex = enCells.indexOf(enDateOneCell!)
      const expectedEnglishPosition = 2 // 日曜日開始: 日(0), 月(1), 火(2)
      expect(enPositionIndex).toBe(expectedEnglishPosition)

      // インドネシア語（月曜日開始）: 火曜日は2番目の列（index 1）に表示される
      const idFirstRow = idContainer.querySelector('tbody tr')
      const idCells = Array.from(idFirstRow!.querySelectorAll('td'))
      const idDateOneCell = idCells.find((cell) => cell.textContent?.includes(targetDateText))
      const idPositionIndex = idCells.indexOf(idDateOneCell!)
      const expectedIndonesianPosition = 1 // 月曜日開始: 月(0), 火(1)
      expect(idPositionIndex).toBe(expectedIndonesianPosition)
    })
  })
})
