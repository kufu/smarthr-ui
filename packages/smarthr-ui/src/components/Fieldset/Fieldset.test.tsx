import { render, screen } from '@testing-library/react'

import { FormControl } from '../FormControl'
import { Input } from '../Input'

import { Fieldset } from './Fieldset'

describe('Fieldset', () => {
  it('子要素が可視ラベルを持つフォームコントロール要素の場合、アクセシブルネームは可視ラベルになる', async () => {
    render(
      <form>
        <Fieldset title="fieldset-title">
          <FormControl title="form-control-title">
            <Input name="test" />
          </FormControl>
        </Fieldset>
      </form>,
    )

    expect(screen.getByRole('textbox', { name: 'form-control-title' })).toBeInTheDocument()
  })

  it('子要素が可視ラベルを持たないフォームコントロール要素の場合、アクセシブルネームにlegend文言を追加する', async () => {
    render(
      <form>
        <Fieldset title="fieldset-title">
          <Input name="test" title="input-title" />
        </Fieldset>
      </form>,
    )

    expect(screen.getByRole('textbox', { name: 'fieldset-title input-title' })).toBeInTheDocument()
  })
})
