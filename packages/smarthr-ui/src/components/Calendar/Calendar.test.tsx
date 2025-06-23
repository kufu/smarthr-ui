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

  describe('i18n化', () => {
    it('日本語で月と年の表示が正しいこと', () => {
      renderWithIntl(<Calendar value={new Date(2020, 0, 15)} onSelectDate={vi.fn()} />, 'ja')

      expect(screen.queryByText('2020年1月')).toBeTruthy()
      expect(screen.getByRole('button', { name: '前の月へ' })).toBeTruthy()
      expect(screen.getByRole('button', { name: '次の月へ' })).toBeTruthy()
      expect(screen.getByRole('button', { name: '年を選択する' })).toBeTruthy()
    })

    it('英語で月と年の表示が正しいこと', () => {
      renderWithIntl(<Calendar value={new Date(2020, 0, 15)} onSelectDate={vi.fn()} />, 'en-us')

      expect(screen.queryByText('Jan 2020')).toBeTruthy()
      expect(screen.getByRole('button', { name: 'Previous month' })).toBeTruthy()
      expect(screen.getByRole('button', { name: 'Next month' })).toBeTruthy()
      expect(screen.getByRole('button', { name: 'Select year' })).toBeTruthy()
    })

    it('異なる月の表示が正しいこと', () => {
      renderWithIntl(<Calendar value={new Date(2020, 11, 15)} onSelectDate={vi.fn()} />, 'ja')
      expect(screen.queryByText('2020年12月')).toBeTruthy()

      renderWithIntl(<Calendar value={new Date(2020, 11, 15)} onSelectDate={vi.fn()} />, 'en-us')
      expect(screen.queryByText('Dec 2020')).toBeTruthy()
    })

    it('年選択ボタンのアクセシビリティが正しいこと', () => {
      renderWithIntl(<Calendar value={new Date(2020, 0, 15)} onSelectDate={vi.fn()} />, 'ja')

      const yearSelectButton = screen.getByRole('button', { name: '年を選択する' })
      expect(yearSelectButton.getAttribute('aria-expanded')).toBe('false')

      act(() => yearSelectButton.click())
      expect(yearSelectButton.getAttribute('aria-expanded')).toBe('true')
    })

    it('ロケールに応じて週の開始日が変わること', () => {
      // 2020年1月1日は水曜日で、月曜日開始の週の3日目
      const testDate = new Date(2020, 0, 1)

      // 日本語（日曜日開始）の場合
      const { container: jaContainer } = renderWithIntl(
        <Calendar value={testDate} onSelectDate={vi.fn()} />,
        'ja',
      )

      // 英語（日曜日開始）の場合
      const { container: enContainer } = renderWithIntl(
        <Calendar value={testDate} onSelectDate={vi.fn()} />,
        'en-us',
      )

      // インドネシア語（月曜日開始）の場合
      const { container: idContainer } = renderWithIntl(
        <Calendar value={testDate} onSelectDate={vi.fn()} />,
        'id-id',
      )

      // 日曜日開始のロケール（日本語、英語）では同じ週の順序になる
      const jaWeekOrder = Array.from(jaContainer.querySelectorAll('th')).map((th) => th.textContent)
      const enWeekOrder = Array.from(enContainer.querySelectorAll('th')).map((th) => th.textContent)
      const idWeekOrder = Array.from(idContainer.querySelectorAll('th')).map((th) => th.textContent)

      // 両方とも日曜日開始なので、最初の曜日は日曜日になる
      expect(jaWeekOrder[0]).toContain('日') // 日本語で日曜日
      expect(enWeekOrder[0]).toContain('Sun') // 英語で日曜日
      expect(idWeekOrder[0]).toContain('Sen') // インドネシア語で月曜日
    })
  })
})
