import { render, screen } from '@testing-library/react'

import { IntlProvider } from '../../intl'

import { TextLink } from './TextLink'

describe('TextLink', () => {
  test('hrefに空文字列を指定し、onClickを指定しない場合、無効化(href属性なし)されること', () => {
    render(
      <IntlProvider locale="ja">
        {/* eslint-disable-next-line smarthr/a11y-anchor-has-href-attribute -- 空文字列hrefの挙動自体を検証するテストのため */}
        <TextLink href="">リンク</TextLink>
      </IntlProvider>,
    )
    expect(screen.getByText('リンク')).not.toHaveAttribute('href')
  })

  test('hrefに空文字列を指定し、onClickも指定する場合、href属性が空文字列のまま付与されること', () => {
    render(
      <IntlProvider locale="ja">
        {/* eslint-disable-next-line smarthr/a11y-anchor-has-href-attribute -- 空文字列hrefの挙動自体を検証するテストのため */}
        <TextLink href="" onClick={vi.fn()}>
          リンク
        </TextLink>
      </IntlProvider>,
    )
    expect(screen.getByText('リンク')).toHaveAttribute('href', '')
  })

  test('hrefにundefinedを指定した場合、href属性が付与されないこと', () => {
    render(
      <IntlProvider locale="ja">
        <TextLink href={undefined}>リンク</TextLink>
      </IntlProvider>,
    )
    expect(screen.getByText('リンク')).not.toHaveAttribute('href')
  })
})
