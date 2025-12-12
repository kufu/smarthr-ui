import { render, screen } from '@testing-library/react'
import { act } from 'react'

import { IntlProvider } from '../../intl'
import { FormControl } from '../FormControl'

import { WarekiPicker } from './WarekiPicker'

describe('WarekiPicker', () => {
  const renderWithIntl = (component: React.ReactElement, locale: 'ja' | 'en-us' = 'ja') =>
    render(<IntlProvider locale={locale}>{component}</IntlProvider>)

  beforeEach(() => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0)
      return 0
    })
  })

  it('日本語で正しく和暦を表示する', () => {
    renderWithIntl(
      <form>
        <FormControl label="WarekiPicker">
          <WarekiPicker value="2024-09-25" name="date" onChangeDate={vi.fn()} />
        </FormControl>
      </form>,
      'ja',
    )

    const textbox = screen.getByRole('textbox', { name: 'WarekiPicker' })
    act(() => textbox.click())

    expect(screen.getByText('令和6年9月25日')).toBeTruthy()
  })

  it('非日本語で正しく和暦を表示する', () => {
    renderWithIntl(
      <form>
        <FormControl label="WarekiPicker">
          <WarekiPicker value="2024-09-25" name="date" onChangeDate={vi.fn()} />
        </FormControl>
      </form>,
      'en-us',
    )

    const textbox = screen.getByRole('textbox', { name: 'WarekiPicker' })
    act(() => textbox.click())

    const warekiText = screen.getByText('September 25, 6 Reiwa')
    expect(warekiText).toBeTruthy()
  })

  it('和暦表示のDatePickerが正しく動作する', async () => {
    renderWithIntl(
      <form>
        <FormControl label="WarekiPicker">
          <WarekiPicker value="2024-09-25" name="date" onChangeDate={vi.fn()} />
        </FormControl>
      </form>,
      'ja',
    )

    const textbox = screen.getByRole('textbox', { name: 'WarekiPicker' })

    act(() => textbox.click())
    expect(textbox).toHaveProperty('ariaExpanded', 'true')

    act(() => screen.getByRole('button', { name: '4' }).click())
    expect(textbox).toHaveProperty('value', '2024/09/04')
    expect(textbox).toHaveProperty('ariaExpanded', 'false')
  })
})
