/* eslint-disable smarthr/require-i18n-text */

import { render, screen } from '@testing-library/react'

import { IntlProvider } from '../../intl'

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
})
