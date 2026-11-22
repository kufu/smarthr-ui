import { render, screen } from '@testing-library/react'

import { Badge } from './Badge'

describe('Badge', () => {
  it('inverted が指定されたときだけ背景色と文字色を反転する', () => {
    const { rerender } = render(<Badge count={12} />)

    expect(screen.getByText('12')).toHaveClass('shr-bg-main', 'shr-text-white')

    rerender(<Badge count={12} inverted />)

    expect(screen.getByText('12')).toHaveClass('shr-bg-white', 'shr-text-main')
    expect(screen.getByText('12')).not.toHaveClass('shr-bg-main')
  })
})
