import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { FormControl } from '../FormGroup'

import { Select } from './Select'

describe('Select', () => {
  it('defaultValue のみ指定した場合(非制御)、初期選択値が反映される', () => {
    render(
      <form>
        <FormControl label="Select">
          <Select
            name="select"
            defaultValue="b"
            options={[
              { label: 'A', value: 'a' },
              { label: 'B', value: 'b' },
            ]}
          />
        </FormControl>
      </form>,
    )

    expect(screen.getByRole('combobox')).toHaveValue('b')
  })

  it('defaultValue のみ指定した場合(非制御)、ユーザー操作で選択値が切り替わる', async () => {
    const user = userEvent.setup()

    render(
      <form>
        <FormControl label="Select">
          <Select
            name="select"
            defaultValue="b"
            options={[
              { label: 'A', value: 'a' },
              { label: 'B', value: 'b' },
            ]}
          />
        </FormControl>
      </form>,
    )

    await user.selectOptions(screen.getByRole('combobox'), 'a')

    expect(screen.getByRole('combobox')).toHaveValue('a')
  })
})
