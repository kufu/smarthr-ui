import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

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

  it('非制御の場合、同じname内でユーザー操作により排他的にチェック状態が切り替わる', async () => {
    const user = userEvent.setup()

    render(
      <form>
        <Fieldset legend="RadioButtonPanel">
          <RadioButtonPanel name="radio" value="a" defaultChecked label="選択肢A" />
          <RadioButtonPanel name="radio" value="b" label="選択肢B" />
        </Fieldset>
      </form>,
    )

    const radioA = screen.getByRole('radio', { name: '選択肢A' })
    const radioB = screen.getByRole('radio', { name: '選択肢B' })
    expect(radioA).toBeChecked()
    expect(radioB).not.toBeChecked()

    await user.click(radioB)

    expect(radioA).not.toBeChecked()
    expect(radioB).toBeChecked()
  })
})
