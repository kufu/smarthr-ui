import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { act } from 'react'

import { EnvironmentProvider } from '../../../hooks/client/useEnvironment'
import { IntlProvider } from '../../../intl'
import { FormControl } from '../../FormGroup'

import { Input } from './Input'

describe('Input', () => {
  it('defaultValue のみ指定した場合(非制御)、初期値が表示される', () => {
    render(
      <form>
        <FormControl label="Input">
          <Input name="input" defaultValue="初期値" />
        </FormControl>
      </form>,
    )

    expect(screen.getByRole('textbox')).toHaveValue('初期値')
  })

  it('defaultValue のみ指定した場合(非制御)、ユーザー入力で値が更新される', async () => {
    const user = userEvent.setup()

    render(
      <form>
        <FormControl label="Input">
          <Input name="input" defaultValue="初期値" />
        </FormControl>
      </form>,
    )

    const input = screen.getByRole('textbox')
    await user.type(input, '追加')

    expect(input).toHaveValue('初期値追加')
  })

  describe('type="date"', () => {
    const renderWithIntl = (component: React.ReactElement, mobile: boolean) =>
      render(
        <IntlProvider locale="ja">
          <EnvironmentProvider environment={{ mobile }}>{component}</EnvironmentProvider>
        </IntlProvider>,
      )

    beforeEach(() => {
      vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
        cb(0)
        return 0
      })
    })

    it('モバイルの場合、ネイティブのdate inputがそのまま使われる', () => {
      renderWithIntl(
        <form>
          <FormControl label="Input">
            <Input type="date" name="input" defaultValue="2024-09-25" />
          </FormControl>
        </form>,
        true,
      )

      // HINT: input[type=date]はrole="textbox"を持たないため、label関連付けで取得する
      const input = screen.getByLabelText('Input')

      expect(input).toHaveAttribute('type', 'date')
      expect(input).not.toHaveAttribute('aria-expanded')
    })

    it('デスクトップの場合、カレンダーUIへ切り替わる', () => {
      renderWithIntl(
        <form>
          <FormControl label="Input">
            <Input type="date" name="input" defaultValue="2024-09-25" />
          </FormControl>
        </form>,
        false,
      )

      const input = screen.getByRole('textbox', { name: 'Input' })

      expect(input).not.toHaveAttribute('type', 'date')
      expect(input).toHaveProperty('value', '2024-09-25')
      expect(input).toHaveProperty('ariaExpanded', 'false')
    })

    it('デスクトップの場合、カレンダーから日付を選択するとISO形式でonChangeが発火する', () => {
      const handleChange = vi.fn()

      renderWithIntl(
        <form>
          <FormControl label="Input">
            <Input type="date" name="input" defaultValue="2024-09-25" onChange={handleChange} />
          </FormControl>
        </form>,
        false,
      )

      const input = screen.getByRole('textbox', { name: 'Input' })

      act(() => input.click())
      expect(input).toHaveProperty('ariaExpanded', 'true')

      act(() => screen.getByRole('button', { name: '4' }).click())

      expect(input).toHaveProperty('value', '2024-09-04')
      expect(input).toHaveProperty('ariaExpanded', 'false')
      expect(handleChange).toHaveBeenCalledTimes(1)
      expect(handleChange.mock.calls[0][0].target.value).toBe('2024-09-04')
    })

    it('デスクトップの場合、和暦の別表記がsuffixに表示される', () => {
      renderWithIntl(
        <form>
          <FormControl label="Input">
            <Input type="date" name="input" defaultValue="2024-09-25" />
          </FormControl>
        </form>,
        false,
      )

      expect(screen.getByText('令和6年9月25日')).toBeVisible()
    })

    it('デスクトップの場合、フォーカスを失うと入力文字列がISO形式にフォーマットされる', async () => {
      const user = userEvent.setup()

      renderWithIntl(
        <form>
          <FormControl label="Input">
            <Input type="date" name="input" />
          </FormControl>
        </form>,
        false,
      )

      const input = screen.getByRole('textbox', { name: 'Input' })
      await user.type(input, '平成4年5月29日{tab}')

      expect(input).toHaveProperty('value', '1992-05-29')
    })
  })
})
