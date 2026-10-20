import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { IntlProvider } from '../../../intl'

import { SearchInput } from './SearchInput'

describe('SearchInput', () => {
  it('defaultValue のみ指定した場合(非制御)、初期値が表示される', () => {
    render(
      <IntlProvider locale="ja">
        <SearchInput name="search" defaultValue="検索ワード" tooltipMessage="ヒント" />
      </IntlProvider>,
    )

    expect(screen.getByRole('textbox')).toHaveValue('検索ワード')
  })

  it('defaultValue のみ指定した場合(非制御)、ユーザー入力で値が更新される', async () => {
    const user = userEvent.setup()

    render(
      <IntlProvider locale="ja">
        <SearchInput name="search" defaultValue="検索ワード" tooltipMessage="ヒント" />
      </IntlProvider>,
    )

    const input = screen.getByRole('textbox')
    await user.type(input, '追加')

    expect(input).toHaveValue('検索ワード追加')
  })

  it('variant="ai"の場合、検索アイコンがグラデーション表示になること', () => {
    render(
      <IntlProvider locale="ja">
        <SearchInput name="search" variant="ai" />
      </IntlProvider>,
    )

    expect(document.querySelector('svg linearGradient')).toBeInTheDocument()
  })
})
