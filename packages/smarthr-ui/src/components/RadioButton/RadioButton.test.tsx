import { render, screen } from '@testing-library/react'

import { Fieldset } from '../FormGroup'

import { RadioButton } from './RadioButton'

describe('RadioButton', () => {
  it('defaultChecked を指定した場合(非制御)、初期状態でチェックされる', () => {
    render(
      <form>
        <Fieldset legend="RadioButton">
          <RadioButton name="radio" value="a" defaultChecked>
            選択肢A
          </RadioButton>
        </Fieldset>
      </form>,
    )

    expect(screen.getByRole('radio', { name: '選択肢A' })).toBeChecked()
  })
})
