import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test } from 'vitest'

import { IntlProvider } from '../../intl'

import { Chip } from './Chip'

test('onDeleteが設定されているとき、削除ボタンを押すとコールバックされる', async () => {
  const onDelete = vi.fn()

  render(
    <IntlProvider locale="ja">
      <Chip onDelete={onDelete} />
    </IntlProvider>,
  )

  await userEvent.click(screen.getByRole('button', { name: '削除' }))

  expect(onDelete).toBeCalled()
})
