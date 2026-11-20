import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { Button } from '../Button'
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

    it('フォームをリセットすると、チェック状態とともに mixed 状態に戻る', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      render(
        <form>
          <Fieldset legend="Checkbox">
            <Checkbox name="checkbox" defaultChecked mixed onChange={onChange}>
              選択肢
            </Checkbox>
            <Button type="reset">リセット</Button>
          </Fieldset>
        </form>,
      )

      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)
      expect(checkbox).not.toBeChecked()
      expect(checkbox).not.toBePartiallyChecked()

      await user.click(screen.getByRole('button', { name: 'リセット' }))

      expect(checkbox).toBeChecked()
      await waitFor(() => expect(checkbox).toBePartiallyChecked())
      expect(onChange).toHaveBeenCalledTimes(1)
    })

    it('リセットがキャンセルされた場合、チェック状態は変わらない', async () => {
      const user = userEvent.setup()

      render(
        <form onReset={(event) => event.preventDefault()}>
          <Fieldset legend="Checkbox">
            <Checkbox name="checkbox" defaultChecked mixed>
              選択肢
            </Checkbox>
            <Button type="reset">リセット</Button>
          </Fieldset>
        </form>,
      )

      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)
      await user.click(screen.getByRole('button', { name: 'リセット' }))

      expect(checkbox).not.toBeChecked()
      expect(checkbox).not.toBePartiallyChecked()
    })

    it('form 属性を変更した後は、新しいフォームのリセットに追従する', async () => {
      const user = userEvent.setup()
      const renderFixture = (form: string) => (
        <>
          <form id="first">
            <Fieldset legend="Checkbox">
              <Checkbox form={form} name="checkbox" defaultChecked mixed>
                選択肢
              </Checkbox>
            </Fieldset>
            <Button type="reset">最初のフォームをリセット</Button>
          </form>
          <form id="second">
            <Button type="reset">2つ目のフォームをリセット</Button>
          </form>
        </>
      )
      const { rerender } = render(renderFixture('first'))

      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)
      rerender(renderFixture('second'))

      await user.click(screen.getByRole('button', { name: '最初のフォームをリセット' }))
      expect(checkbox).not.toBeChecked()
      expect(checkbox).not.toBePartiallyChecked()

      await user.click(screen.getByRole('button', { name: '2つ目のフォームをリセット' }))
      expect(checkbox).toBeChecked()
      await waitFor(() => expect(checkbox).toBePartiallyChecked())
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
