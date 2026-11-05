import { act, render, screen } from '@testing-library/react'
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

  it('defaultValue のみ指定した場合(非制御)、フォーカス中のユーザー入力で値が更新される', async () => {
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
    await user.type(input, '5')

    expect(input).toHaveValue('10005')
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

  it('非制御で値を変更後、form.reset()を呼ぶとdefaultValueのフォーマット済みの値に戻ること', async () => {
    const user = userEvent.setup()

    const { container } = render(
      <form>
        <FormControl label="CurrencyInput">
          <CurrencyInput name="currency" defaultValue="1000" />
        </FormControl>
      </form>,
    )

    const input = screen.getByRole('textbox')
    await user.click(input)
    await user.clear(input)
    await user.type(input, '2000000')
    await user.tab()

    expect(input).toHaveValue('2,000,000')

    act(() => {
      container.querySelector('form')!.reset()
    })

    // HINT: resetイベントは実際に値がリセットされる前に発火するため、
    // CurrencyInput側はrequestAnimationFrameで次のフレームまでフォーマットを遅延させている
    await act(async () => {
      await new Promise((resolve) => requestAnimationFrame(resolve))
    })

    expect(input).toHaveValue('1,000')
  })

  it('制御時(value指定)は、form.reset()を呼んでも表示が変わらないこと', () => {
    const { container } = render(
      <form>
        <FormControl label="CurrencyInput">
          <CurrencyInput name="currency" value="2,000,000" onChange={() => {}} />
        </FormControl>
      </form>,
    )

    const input = screen.getByRole('textbox')

    expect(input).toHaveValue('2,000,000')

    act(() => {
      container.querySelector('form')!.reset()
    })

    expect(input).toHaveValue('2,000,000')
  })
})
