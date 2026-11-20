import { render, screen } from '@testing-library/react'

import { IntlProvider } from '../../intl'
import { FaCircleInfoIcon } from '../Icon'

import { TextLink } from './TextLink'

describe('TextLink', () => {
  describe('無効化時の見た目', () => {
    it('href未指定時に無効化色・カーソルのクラスが付与される', () => {
      render(
        <IntlProvider locale="ja">
          {/* eslint-disable-next-line smarthr/a11y-anchor-has-href-attribute */}
          <TextLink>リンク</TextLink>
        </IntlProvider>,
      )
      const anchor = screen.getByText('リンク').closest('a')
      expect(anchor).not.toHaveAttribute('href')
      expect(anchor).toHaveClass('[&:not([href])]:shr-text-disabled')
      expect(anchor).toHaveClass('[&:not([href])]:shr-cursor-not-allowed')
    })

    it('固定colorを持つprefixアイコンでも、href未指定時に無効化色へ揃えるクラスが付与される', () => {
      render(
        <IntlProvider locale="ja">
          {/* eslint-disable-next-line smarthr/a11y-anchor-has-href-attribute */}
          <TextLink prefix={<FaCircleInfoIcon color="MAIN" />}>リンク</TextLink>
        </IntlProvider>,
      )
      const anchor = screen.getByText('リンク').closest('a')
      expect(anchor).toHaveClass('[&:not([href])_.smarthr-ui-Icon]:!shr-text-color-inherit')
      expect(anchor).toHaveClass('[&:not([href])_.smarthr-ui-Icon]:shr-fill-current')
    })

    it('onClickのみ指定時は空文字のhrefが設定され、無効化扱いにならない(既存挙動の確認)', () => {
      render(
        <IntlProvider locale="ja">
          {/* eslint-disable-next-line smarthr/a11y-anchor-has-href-attribute */}
          <TextLink onClick={() => {}}>リンク</TextLink>
        </IntlProvider>,
      )
      const anchor = screen.getByText('リンク').closest('a')
      expect(anchor).toHaveAttribute('href', '')
    })

    it('href指定時はhref属性がそのまま設定される', () => {
      render(
        <IntlProvider locale="ja">
          <TextLink href="/path">リンク</TextLink>
        </IntlProvider>,
      )
      expect(screen.getByRole('link', { name: 'リンク' })).toHaveAttribute('href', '/path')
    })
  })
})
