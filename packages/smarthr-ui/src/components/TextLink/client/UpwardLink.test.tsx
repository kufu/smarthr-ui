import { render, screen } from '@testing-library/react'
import { forwardRef } from 'react'

import { UpwardLink } from './UpwardLink'

const CustomLink = forwardRef<HTMLAnchorElement, { to: string; children?: React.ReactNode }>(
  ({ to, children }, ref) => (
    <a ref={ref} href={to} data-custom-link="true">
      {children}
    </a>
  ),
)

describe('UpwardLink', () => {
  test('elementAsにカスタムコンポーネントを指定した場合、固有のprops(to等)がそのまま渡されること', () => {
    render(
      <UpwardLink elementAs={CustomLink} href={undefined} to="/path">
        一覧に戻る
      </UpwardLink>,
    )
    const link = screen.getByText('一覧に戻る')
    expect(link).toHaveAttribute('data-custom-link', 'true')
    expect(link).toHaveAttribute('href', '/path')
  })

  test('elementAsを指定しない場合、通常のa要素としてレンダリングされること', () => {
    render(<UpwardLink href="/path">一覧に戻る</UpwardLink>)
    expect(screen.getByText('一覧に戻る').tagName).toBe('A')
  })
})
