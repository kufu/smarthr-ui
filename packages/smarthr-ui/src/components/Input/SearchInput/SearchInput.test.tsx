import { render, screen } from '@testing-library/react'

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
})
