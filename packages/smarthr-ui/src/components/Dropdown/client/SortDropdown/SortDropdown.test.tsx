import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { IntlProvider } from '../../../../intl'

import { SortDropdown } from './SortDropdown'

describe('SortDropdown', () => {
  it.each([
    { title: 'ラベルが同じ', firstLabel: '日付', secondLabel: '日付' },
    { title: 'ラベルがない', firstLabel: undefined, secondLabel: undefined },
    { title: 'ラベルが異なる', firstLabel: '開始日', secondLabel: '終了日' },
  ])('$title選択肢から変更しても、適用する項目を1つに絞る', async ({ firstLabel, secondLabel }) => {
    const user = userEvent.setup()
    const onApply = vi.fn()
    const sortFields = [
      { label: firstLabel, value: 'start', selected: true },
      { label: secondLabel, value: 'end' },
      { label: '更新日', value: 'updated', disabled: true },
    ]

    render(
      <IntlProvider locale="ja">
        <SortDropdown defaultOrder="desc" sortFields={sortFields} onApply={onApply} />
      </IntlProvider>,
    )

    await user.click(screen.getByRole('button', { name: /降順/ }))
    const select = screen.getByRole('combobox', { name: '並べ替え項目' })
    expect(select).toHaveValue('start')

    await user.selectOptions(select, 'end')
    expect(select).toHaveValue('end')

    await user.click(screen.getByRole('button', { name: '適用' }))
    expect(onApply).toHaveBeenCalledExactlyOnceWith({
      field: secondLabel ?? '',
      order: 'desc',
      newfields: [
        { ...sortFields[0], selected: false },
        { ...sortFields[1], selected: true },
        sortFields[2],
      ],
    })
  })
})
