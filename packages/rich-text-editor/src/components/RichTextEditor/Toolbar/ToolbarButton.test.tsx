import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Profiler } from 'react'
import { renderToString } from 'react-dom/server'
import { EnvironmentProvider } from 'smarthr-ui'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import { ToolbarButton } from './ToolbarButton'

import type { ReactNode } from 'react'

beforeAll(() => {
  globalThis.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  } as unknown as typeof IntersectionObserver
})

afterEach(() => {
  vi.restoreAllMocks()
})

const Wrapper = ({ children }: { children: ReactNode }) => (
  <EnvironmentProvider>{children}</EnvironmentProvider>
)

const tooltipOf = (label: string) =>
  screen.queryAllByText(label).find((el) => el.tagName === 'SPAN') ?? null

describe('ToolbarButton', () => {
  it('ポップアップを閉じているときはホバーでツールチップを表示する', async () => {
    render(<ToolbarButton aria-expanded={false} icon={null} label="表を挿入" />, {
      wrapper: Wrapper,
    })

    await userEvent.hover(screen.getByRole('button', { name: '表を挿入' }))

    expect(tooltipOf('表を挿入')).not.toBeNull()
  })

  it('ポップアップを開いているあいだはホバーしてもツールチップを表示しない', async () => {
    render(<ToolbarButton aria-expanded icon={null} label="表を挿入" />, { wrapper: Wrapper })

    await userEvent.hover(screen.getByRole('button', { name: '表を挿入' }))

    expect(tooltipOf('表を挿入')).toBeNull()
  })

  it('Apple の環境では、最初の描画から ⌘ のショートカットを伝える', async () => {
    vi.spyOn(navigator, 'platform', 'get').mockReturnValue('MacIntel')
    // 判定はモジュールに覚えられるため、前のテストで覚えた値を引き継がないよう読み直す
    vi.resetModules()
    const { ToolbarButton: FreshToolbarButton } = await import('./ToolbarButton')
    // 読み直した ToolbarButton は読み直した smarthr-ui の Context を見るため、Provider も読み直したものを使う
    const { EnvironmentProvider: FreshEnvironmentProvider } = await import('smarthr-ui')
    const firstCommitShortcuts: Array<string | null> = []

    render(
      <Profiler
        id="button"
        onRender={() => {
          if (firstCommitShortcuts.length === 0) {
            firstCommitShortcuts.push(
              document.querySelector('button')?.getAttribute('aria-keyshortcuts') ?? null,
            )
          }
        }}
      >
        <FreshToolbarButton shortcut="Mod-B" icon={null} label="太字" />
      </Profiler>,
      {
        wrapper: ({ children }: { children: ReactNode }) => (
          <FreshEnvironmentProvider>{children}</FreshEnvironmentProvider>
        ),
      },
    )

    expect(firstCommitShortcuts).toEqual(['Meta+B'])
  })

  it('サーバーでの描画では Ctrl のショートカットを伝える', () => {
    const html = renderToString(
      <EnvironmentProvider>
        <ToolbarButton shortcut="Mod-B" icon={null} label="太字" />
      </EnvironmentProvider>,
    )

    expect(html).toContain('aria-keyshortcuts="Control+B"')
  })
})
