/* eslint-disable smarthr/a11y-input-in-form-control */
import { render, screen } from '@testing-library/react'

import { RadioButton } from './RadioButton'

test('ラベルが設定される', () => {
  render(<RadioButton name="group">ラベル</RadioButton>)

  expect(screen.getByRole('radio', { name: 'ラベル' })).toBeInTheDocument()
})
