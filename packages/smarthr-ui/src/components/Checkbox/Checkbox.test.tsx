import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { Fieldset } from '../FormGroup'

import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  describe('mixed', () => {
    it('checked と mixed を指定した場合(制御)、mixed状態になる', () => {
      render(
        <form>
          <Fieldset legend="Checkbox">
            <Checkbox name="checkbox" checked mixed onChange={() => {}}>
              選択肢
            </Checkbox>
          </Fieldset>
        </form>,
      )

      expect(screen.getByRole('checkbox')).toBePartiallyChecked()
    })

    it('defaultChecked と mixed を指定した場合(非制御)、mixed状態になる', () => {
      render(
        <form>
          <Fieldset legend="Checkbox">
            <Checkbox name="checkbox" defaultChecked mixed>
              選択肢
            </Checkbox>
          </Fieldset>
        </form>,
      )

      expect(screen.getByRole('checkbox')).toBePartiallyChecked()
    })

    it('defaultChecked と mixed を指定した場合(非制御)、ユーザー操作でuncheckedにするとmixedが解除される', async () => {
      const user = userEvent.setup()

      render(
        <form>
          <Fieldset legend="Checkbox">
            <Checkbox name="checkbox" defaultChecked mixed>
              選択肢
            </Checkbox>
          </Fieldset>
        </form>,
      )

      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)

      expect(checkbox).not.toBePartiallyChecked()
      expect(checkbox).not.toBeChecked()
    })

    it('defaultChecked と mixed を指定した場合(非制御)、ユーザー操作でunchecked→checkedと戻すとmixedが再び機能する', async () => {
      const user = userEvent.setup()

      render(
        <form>
          <Fieldset legend="Checkbox">
            <Checkbox name="checkbox" defaultChecked mixed>
              選択肢
            </Checkbox>
          </Fieldset>
        </form>,
      )

      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)
      await user.click(checkbox)

      expect(checkbox).toBePartiallyChecked()
    })

    it('mixed を指定したまま checked のみプログラム的に変化した場合(制御)、mixed状態が追従する', async () => {
      const { rerender } = render(
        <form>
          <Fieldset legend="Checkbox">
            <Checkbox name="checkbox" checked={false} mixed onChange={() => {}}>
              選択肢
            </Checkbox>
          </Fieldset>
        </form>,
      )

      expect(screen.getByRole('checkbox')).not.toBePartiallyChecked()

      rerender(
        <form>
          <Fieldset legend="Checkbox">
            <Checkbox name="checkbox" checked={true} mixed onChange={() => {}}>
              選択肢
            </Checkbox>
          </Fieldset>
        </form>,
      )

      await waitFor(() => {
        expect(screen.getByRole('checkbox')).toBePartiallyChecked()
      })
    })
  })
})
