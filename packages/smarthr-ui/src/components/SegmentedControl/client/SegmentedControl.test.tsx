import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { SegmentedControl } from './SegmentedControl'

const options = [
  { value: 'a', content: 'A' },
  { value: 'b', content: 'B' },
]

describe('SegmentedControl', () => {
  it('defaultValue のみ指定した場合(非制御)、初期選択状態が反映される', () => {
    render(<SegmentedControl defaultValue="a" options={options} />)

    expect(screen.getByRole('radio', { name: 'A' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'B' })).toHaveAttribute('aria-checked', 'false')
  })

  it('defaultValue のみ指定した場合(非制御)、ユーザー操作で選択状態が切り替わる', async () => {
    const user = userEvent.setup()

    render(<SegmentedControl defaultValue="a" options={options} />)

    await user.click(screen.getByRole('radio', { name: 'B' }))

    expect(screen.getByRole('radio', { name: 'A' })).toHaveAttribute('aria-checked', 'false')
    expect(screen.getByRole('radio', { name: 'B' })).toHaveAttribute('aria-checked', 'true')
  })

  it('value と onClickOption を指定した場合(制御)、ユーザー操作だけでは選択状態が変わらない', async () => {
    const user = userEvent.setup()
    const handleClickOption = vi.fn()

    render(<SegmentedControl value="a" onClickOption={handleClickOption} options={options} />)

    await user.click(screen.getByRole('radio', { name: 'B' }))

    expect(handleClickOption).toHaveBeenCalledWith('b')
    expect(screen.getByRole('radio', { name: 'A' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'B' })).toHaveAttribute('aria-checked', 'false')
  })

  it('空文字列を選択値に持つ選択肢をdefaultValueに指定した場合、選択状態として扱われる', () => {
    const optionsWithEmptyValue = [
      { value: '', content: 'Empty' },
      { value: 'a', content: 'A' },
    ]

    render(<SegmentedControl defaultValue="" options={optionsWithEmptyValue} />)

    expect(screen.getByRole('radio', { name: 'Empty' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'A' })).toHaveAttribute('aria-checked', 'false')
  })
})
