import { render, screen } from '@testing-library/react'
import { forwardRef } from 'react'

import { IntlProvider } from '../../intl'

import { HeaderLink } from './HeaderLink'

const CustomLink = forwardRef<HTMLAnchorElement, { to: string; children?: React.ReactNode }>(
  ({ to, children }, ref) => (
    <a ref={ref} href={to} data-custom-link="true">
      {children}
    </a>
  ),
)

describe('HeaderLink', () => {
  test('elementAsにカスタムコンポーネントを指定した場合、固有のprops(to等)がそのまま渡されること', () => {
    render(
      <IntlProvider locale="ja">
        <HeaderLink elementAs={CustomLink} href={undefined} to="/path">
          リンク
        </HeaderLink>
      </IntlProvider>,
    )
    const link = screen.getByText('リンク').closest('a')
    expect(link).toHaveAttribute('data-custom-link', 'true')
    expect(link).toHaveAttribute('href', '/path')
  })

  test('elementAsを指定しない場合、通常のa要素としてレンダリングされること', () => {
    render(
      <IntlProvider locale="ja">
        <HeaderLink href="/path">リンク</HeaderLink>
      </IntlProvider>,
    )
    expect(screen.getByText('リンク').closest('a')).toBeInTheDocument()
  })
})
