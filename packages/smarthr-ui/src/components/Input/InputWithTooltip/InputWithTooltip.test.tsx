import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { InputWithTooltip } from './InputWithTooltip'

describe('InputWithTooltip', () => {
  it('defaultValue のみ指定した場合(非制御)、初期値が表示される', () => {
    render(<InputWithTooltip name="input" defaultValue="初期値" tooltipMessage="ヒント" />)

    expect(screen.getByRole('textbox')).toHaveValue('初期値')
  })

  it('defaultValue のみ指定した場合(非制御)、ユーザー入力で値が更新される', async () => {
    const user = userEvent.setup()

    render(<InputWithTooltip name="input" defaultValue="初期値" tooltipMessage="ヒント" />)

    const input = screen.getByRole('textbox')
    await user.type(input, '追加')

    expect(input).toHaveValue('初期値追加')
  })
})
