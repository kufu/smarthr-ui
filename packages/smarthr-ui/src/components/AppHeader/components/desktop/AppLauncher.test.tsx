import { act, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { IntlProvider } from '../../../../intl'

import { AppLauncher } from './AppLauncher'

import type { Launcher } from '../../types'

describe('AppLauncher', () => {
  let originalMatchMedia: typeof window.matchMedia

  beforeEach(() => {
    originalMatchMedia = window.matchMedia
    // HINT: AppHeader/hooks/useMediaQuery.ts が素の matchMedia() を呼ぶため、jsdom 用にスタブする
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  const buildFeature = (id: string, name: string): Launcher['feature'] => ({
    id,
    name,
    url: `https://example.com/${id}`,
    favorite: true,
  })

  const renderAppLauncher = () =>
    render(
      <IntlProvider locale="ja">
        <AppLauncher features={[buildFeature('1', 'アプリA'), buildFeature('2', 'アプリB')]} />
      </IntlProvider>,
    )

  const searchInput = () => screen.getByRole('textbox')

  it('検索欄に入力するとクリアボタンが表示されること', async () => {
    const user = userEvent.setup()
    renderAppLauncher()

    expect(screen.queryByRole('button', { name: '' })).not.toBeInTheDocument()

    await user.type(searchInput(), 'アプリA')

    expect(searchInput()).toHaveValue('アプリA')
    expect(screen.getByRole('button', { name: '' })).toBeInTheDocument()
  })

  it('クリアボタンを押下すると検索欄にフォーカスが戻り、入力値がクリアされること', async () => {
    const user = userEvent.setup()
    renderAppLauncher()

    await user.type(searchInput(), 'アプリA')
    await user.click(screen.getByRole('button', { name: '' }))

    expect(searchInput()).toHaveFocus()

    await act(async () => {
      await new Promise(requestAnimationFrame)
    })

    expect(searchInput()).toHaveValue('')
    expect(screen.queryByRole('button', { name: '' })).not.toBeInTheDocument()
  })
})
