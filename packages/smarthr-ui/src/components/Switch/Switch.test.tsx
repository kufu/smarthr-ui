import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { Switch } from './Switch'

describe('Switch', () => {
  it('defaultChecked を指定した場合(非制御)、初期状態でオンになる', () => {
    render(
      <Switch name="switch" defaultChecked>
        スイッチ
      </Switch>,
    )

    expect(screen.getByRole('switch', { name: 'スイッチ' })).toBeChecked()
  })

  it('非制御の場合、複数設置してもユーザー操作で各Switchが独立してオン/オフを切り替えられる', async () => {
    const user = userEvent.setup()

    render(
      <>
        <Switch name="switch-a">スイッチA</Switch>
        <Switch name="switch-b" defaultChecked>
          スイッチB
        </Switch>
      </>,
    )

    const switchA = screen.getByRole('switch', { name: 'スイッチA' })
    const switchB = screen.getByRole('switch', { name: 'スイッチB' })
    expect(switchA).not.toBeChecked()
    expect(switchB).toBeChecked()

    await user.click(switchA)

    expect(switchA).toBeChecked()
    expect(switchB).toBeChecked()
  })
})
