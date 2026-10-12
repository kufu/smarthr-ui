import { render, screen } from '@testing-library/react'

import { InputWithTooltip } from './InputWithTooltip'

describe('InputWithTooltip', () => {
  it('defaultValue のみ指定した場合(非制御)、初期値が表示される', () => {
    render(<InputWithTooltip name="input" defaultValue="初期値" tooltipMessage="ヒント" />)

    expect(screen.getByRole('textbox')).toHaveValue('初期値')
  })
})
