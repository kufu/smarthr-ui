import { render, screen } from '@testing-library/react'

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
})
