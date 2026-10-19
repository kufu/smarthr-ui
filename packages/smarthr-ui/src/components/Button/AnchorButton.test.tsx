import { render, screen } from '@testing-library/react'

import { IntlProvider } from '../../intl'
import { FaCircleInfoIcon } from '../Icon'

import { AnchorButton } from './AnchorButton'

describe('AnchorButton', () => {
  test('target="_blank"を指定した場合にアイコンを表示する', () => {
    render(
      <IntlProvider locale="ja">
        <AnchorButton target="_blank" href="/">
          新規作成
        </AnchorButton>
      </IntlProvider>,
    )
    expect(screen.getByRole('link', { name: '新規作成 別タブで開く' })).toBeVisible()
  })

  describe('無効化時のアイコン色', () => {
    it('固定colorを持つprefixアイコンでも、href未指定時に無効化色へ揃えるクラスが付与される', () => {
      render(
        <IntlProvider locale="ja">
          <AnchorButton prefix={<FaCircleInfoIcon color="MAIN" />}>新規作成</AnchorButton>
        </IntlProvider>,
      )
      const wrapper = screen.getByText('新規作成').closest('a')
      expect(wrapper).toHaveClass('[&:not([href])_.smarthr-ui-Icon]:!shr-text-color-inherit')
      expect(wrapper).toHaveClass('[&:not([href])_.smarthr-ui-Icon]:shr-fill-current')
    })
  })
})
