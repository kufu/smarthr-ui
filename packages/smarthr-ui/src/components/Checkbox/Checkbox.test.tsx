import { render, screen } from '@testing-library/react'

import { Checkbox } from './Checkbox'

test('ラベルが設定される', () => {
  render(<Checkbox name="agree">ラベル</Checkbox>)

  expect(screen.getByRole('checkbox', { name: 'ラベル' })).toBeInTheDocument()
})
