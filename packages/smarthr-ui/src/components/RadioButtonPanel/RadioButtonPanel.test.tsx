import { render, screen } from '@testing-library/react'

import { Fieldset } from '../FormGroup'

import { RadioButtonPanel } from './RadioButtonPanel'

describe('RadioButtonPanel', () => {
  it('defaultChecked を指定した場合(非制御)、初期状態でチェックされる', () => {
    render(
      <form>
        <Fieldset legend="RadioButtonPanel">
          <RadioButtonPanel name="radio" value="a" defaultChecked label="選択肢A" />
        </Fieldset>
      </form>,
    )

    expect(screen.getByRole('radio', { name: '選択肢A' })).toBeChecked()
  })
})
