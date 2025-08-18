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
        {/* アクセシブルネームを付けるのにtitleは最適ではないためルール修正まで一時的にdisableにしている */}
        {/* eslint-disable-next-line smarthr/a11y-input-in-form-control */}
        <Fieldset title="fieldset-title">
          <Input name="test1" aria-label="input-accessible-name-1" />
          <Input name="test2" aria-label="input-accessible-name-2" />
        </Fieldset>
      </form>,
    )

    expect(
      screen.getByRole('textbox', { name: 'input-accessible-name-1 fieldset-title' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('textbox', { name: 'input-accessible-name-2 fieldset-title' }),
    ).toBeInTheDocument()
  })
})
