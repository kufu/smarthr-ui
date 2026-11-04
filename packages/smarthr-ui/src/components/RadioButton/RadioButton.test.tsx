import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

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

  it('非制御の場合、同じname内でユーザー操作により排他的にチェック状態が切り替わる', async () => {
    const user = userEvent.setup()

    render(
      <form>
        <Fieldset legend="RadioButton">
          <RadioButton name="radio" value="a" defaultChecked>
            選択肢A
          </RadioButton>
          <RadioButton name="radio" value="b">
            選択肢B
          </RadioButton>
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
