import { render, screen } from '@testing-library/react'

import { Input } from '../Input'

import { FormControl } from './FormControl'

describe('FormControl', () => {
  it('errorMessagesが指定されている場合、子のinput要素にaria-invalidが付与される', () => {
    render(
      <form>
        <FormControl errorMessages="error" label="label">
          <Input name="test" />
        </FormControl>
      </form>,
    )

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('errorMessagesが指定されていない場合、子のinput要素にaria-invalidが付与されない', () => {
    render(
      <form>
        <FormControl label="label">
          <Input name="test" />
        </FormControl>
      </form>,
    )

    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid')
  })

  it('autoBindErrorInput:falseの場合、errorMessagesが指定されていても子のinput要素にaria-invalidが付与されない', () => {
    render(
      <form>
        <FormControl errorMessages="error" autoBindErrorInput={false} label="label">
          <Input name="test" />
        </FormControl>
      </form>,
    )

    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid')
  })
})
