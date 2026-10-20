import { render, screen } from '@testing-library/react'
import { forwardRef } from 'react'

import { HelpLink } from './HelpLink'

const CustomLink = forwardRef<HTMLAnchorElement, { to: string; children?: React.ReactNode }>(
  ({ to, children }, ref) => (
    <a ref={ref} href={to} data-custom-link="true">
      {children}
    </a>
  ),
)

describe('HelpLink', () => {
  test('elementAsにカスタムコンポーネントを指定した場合、固有のprops(to等)がそのまま渡されること', () => {
    render(
      <HelpLink elementAs={CustomLink} href={undefined} to="/path">
        リンク
      </HelpLink>,
    )
    const link = screen.getByText('リンク')
    expect(link).toHaveAttribute('data-custom-link', 'true')
    expect(link).toHaveAttribute('href', '/path')
  })

  test('elementAsを指定しない場合、通常のa要素としてレンダリングされること', () => {
    render(<HelpLink href="/path">リンク</HelpLink>)
    expect(screen.getByText('リンク').tagName).toBe('A')
  })
})
