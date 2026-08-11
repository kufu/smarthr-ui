import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { IntlProvider } from '../../../intl'

import { MoreFormatsToggle } from './MoreFormatsToggle'

import type { ReactNode } from 'react'

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">{children}</IntlProvider>
)

const NOOP = () => undefined

describe('MoreFormatsToggle', () => {
  it('閉じているとき aria-expanded が false で、2段目の id を aria-controls で指す', () => {
    render(<MoreFormatsToggle expanded={false} controls="secondary-row" handleClick={NOOP} />, {
      wrapper: Wrapper,
    })

    const button = screen.getByRole('button', { name: 'その他の書式' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveAttribute('aria-controls', 'secondary-row')
  })

  it('開いているとき aria-expanded が true になる', () => {
    render(<MoreFormatsToggle expanded={true} controls="secondary-row" handleClick={NOOP} />, {
      wrapper: Wrapper,
    })

    expect(screen.getByRole('button', { name: 'その他の書式' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  it('開閉状態は押した状態（aria-pressed）としては表現しない', () => {
    render(<MoreFormatsToggle expanded={false} controls="secondary-row" handleClick={NOOP} />, {
      wrapper: Wrapper,
    })

    // aria-expanded と aria-pressed の併用は状態表現の二重化になるため付けない
    expect(screen.getByRole('button', { name: 'その他の書式' })).not.toHaveAttribute('aria-pressed')
  })

  it('押すと handleClick が呼ばれる', async () => {
    const handleClick = vi.fn()
    render(
      <MoreFormatsToggle expanded={false} controls="secondary-row" handleClick={handleClick} />,
      { wrapper: Wrapper },
    )

    await userEvent.click(screen.getByRole('button', { name: 'その他の書式' }))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('disabled のときネイティブの disabled になる', () => {
    render(
      <MoreFormatsToggle expanded={false} controls="secondary-row" handleClick={NOOP} disabled />,
      { wrapper: Wrapper },
    )

    expect(screen.getByRole('button', { name: 'その他の書式' })).toBeDisabled()
  })
})
