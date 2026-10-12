import { render, screen } from '@testing-library/react'

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
})
