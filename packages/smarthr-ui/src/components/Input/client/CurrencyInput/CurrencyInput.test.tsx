import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { FormControl } from '../../../FormGroup'

import { CurrencyInput } from './CurrencyInput'

describe('CurrencyInput', () => {
  it('defaultValue のみ指定した場合(非制御)、マウント時にフォーマットされた値が表示される', () => {
    render(
      <form>
        <FormControl label="CurrencyInput">
          <CurrencyInput name="currency" defaultValue="1000" />
        </FormControl>
      </form>,
    )

    expect(screen.getByRole('textbox')).toHaveValue('1,000')
  })

  it('defaultValue のみ指定した場合(非制御)、フォーカス時はカンマなしの生の値になる', async () => {
    const user = userEvent.setup()

    render(
      <form>
        <FormControl label="CurrencyInput">
          <CurrencyInput name="currency" defaultValue="1000" />
        </FormControl>
      </form>,
    )

    const input = screen.getByRole('textbox')
    await user.click(input)

    expect(input).toHaveValue('1000')
  })

  it('defaultValue のみ指定した場合(非制御)、フォーカスを外すと再度フォーマットされる', async () => {
    const user = userEvent.setup()

    render(
      <form>
        <FormControl label="CurrencyInput">
          <CurrencyInput name="currency" defaultValue="1000" />
        </FormControl>
      </form>,
    )

    const input = screen.getByRole('textbox')
    await user.click(input)
    await user.tab()

    expect(input).toHaveValue('1,000')
  })
})
