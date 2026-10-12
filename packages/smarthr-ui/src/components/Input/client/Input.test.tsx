import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

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
})
