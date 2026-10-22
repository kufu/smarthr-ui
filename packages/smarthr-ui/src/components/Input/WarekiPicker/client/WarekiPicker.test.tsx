import { render, screen } from '@testing-library/react'
import { act, useState } from 'react'

import { IntlProvider } from '../../../../intl'
import { FormControl } from '../../../FormGroup'

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
          <WarekiPicker name="date" value="2024-09-25" onChangeDate={vi.fn()} />
        </FormControl>
      </form>,
      'ja',
    )

    const textbox = screen.getByRole('textbox', { name: /^WarekiPicker/ })
    act(() => textbox.click())

    expect(screen.getByText('令和6年9月25日')).toBeTruthy()
  })

  it('非日本語で正しく和暦を表示する', () => {
    renderWithIntl(
      <form>
        <FormControl label="WarekiPicker">
          <WarekiPicker name="date" value="2024-09-25" onChangeDate={vi.fn()} />
        </FormControl>
      </form>,
      'en-us',
    )

    const textbox = screen.getByRole('textbox', { name: /^WarekiPicker/ })
    act(() => textbox.click())

    const warekiText = screen.getByText('September 25, 6 Reiwa')
    expect(warekiText).toBeTruthy()
  })

  it('和暦表示のDatePickerが正しく動作する', async () => {
    renderWithIntl(
      <form>
        <FormControl label="WarekiPicker">
          <WarekiPicker name="date" value="2024-09-25" onChangeDate={vi.fn()} />
        </FormControl>
      </form>,
      'ja',
    )

    const textbox = screen.getByRole('textbox', { name: /^WarekiPicker/ })

    act(() => textbox.click())
    expect(textbox).toHaveProperty('ariaExpanded', 'true')

    act(() => screen.getByRole('button', { name: '4' }).click())
    expect(textbox).toHaveProperty('value', '2024/09/04')
    expect(textbox).toHaveProperty('ariaExpanded', 'false')
  })

  it('showAlternativeにfalseを指定した場合、和暦の別表記を表示しない', () => {
    renderWithIntl(
      <form>
        <FormControl label="WarekiPicker">
          <WarekiPicker
            name="date"
            value="2024-09-25"
            showAlternative={false}
            onChangeDate={vi.fn()}
          />
        </FormControl>
      </form>,
      'ja',
    )

    const textbox = screen.getByRole('textbox', { name: 'WarekiPicker' })
    act(() => textbox.click())

    expect(screen.queryByText('令和6年9月25日')).not.toBeInTheDocument()
  })

  it('showAlternativeに関数を指定した場合、その関数の結果を別表記として表示する', () => {
    renderWithIntl(
      <form>
        <FormControl label="WarekiPicker">
          <WarekiPicker
            name="date"
            value="2024-09-25"
            showAlternative={(date) => (date ? `custom:${date.getFullYear()}` : null)}
            onChangeDate={vi.fn()}
          />
        </FormControl>
      </form>,
      'ja',
    )

    const textbox = screen.getByRole('textbox', { name: 'WarekiPicker' })
    act(() => textbox.click())

    expect(screen.getByText('custom:2024')).toBeTruthy()
    expect(screen.queryByText('令和6年9月25日')).not.toBeInTheDocument()
  })

  it('showAlternativeの値を動的に切り替えても再マウントされない', () => {
    const Wrapper = () => {
      const [showAlternative, setShowAlternative] = useState(true)

      return (
        <form>
          <FormControl label="WarekiPicker">
            <WarekiPicker
              name="date"
              defaultValue="2024-09-25"
              showAlternative={showAlternative}
              onChangeDate={vi.fn()}
            />
          </FormControl>
          <button type="button" onClick={() => setShowAlternative(false)}>
            toggle
          </button>
        </form>
      )
    }

    renderWithIntl(<Wrapper />)

    const textboxBefore = screen.getByRole('textbox', { name: 'WarekiPicker' })

    expect(screen.getByText('令和6年9月25日')).toBeTruthy()

    act(() => screen.getByRole('button', { name: 'toggle' }).click())

    const textboxAfter = screen.getByRole('textbox', { name: 'WarekiPicker' })

    expect(textboxAfter).toBe(textboxBefore)
    expect(textboxAfter).toHaveProperty('value', '2024/09/25')
  })

  it('選択日が変わらないままshowAlternativeをtrueからfalseに切り替えると、別表記が消える', () => {
    const Wrapper = () => {
      const [showAlternative, setShowAlternative] = useState(true)

      return (
        <form>
          <FormControl label="WarekiPicker">
            <WarekiPicker
              name="date"
              defaultValue="2024-09-25"
              showAlternative={showAlternative}
              onChangeDate={vi.fn()}
            />
          </FormControl>
          <button type="button" onClick={() => setShowAlternative(false)}>
            toggle
          </button>
        </form>
      )
    }

    renderWithIntl(<Wrapper />)

    expect(screen.getByText('令和6年9月25日')).toBeTruthy()

    act(() => screen.getByRole('button', { name: 'toggle' }).click())

    expect(screen.queryByText('令和6年9月25日')).not.toBeInTheDocument()
  })
})
