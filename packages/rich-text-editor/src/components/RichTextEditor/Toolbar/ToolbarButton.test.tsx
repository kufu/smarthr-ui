import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Profiler } from 'react'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import { ToolbarButton } from './ToolbarButton'

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

const tooltipOf = (label: string) =>
  screen.queryAllByText(label).find((el) => el.tagName === 'SPAN') ?? null

describe('ToolbarButton', () => {
  it('ポップアップを閉じているときはホバーでツールチップを表示する', async () => {
    render(<ToolbarButton aria-expanded={false} icon={null} label="表を挿入" />)

    await userEvent.hover(screen.getByRole('button', { name: '表を挿入' }))

    expect(tooltipOf('表を挿入')).not.toBeNull()
  })

  it('ポップアップを開いているあいだはホバーしてもツールチップを表示しない', async () => {
    render(<ToolbarButton aria-expanded icon={null} label="表を挿入" />)

    await userEvent.hover(screen.getByRole('button', { name: '表を挿入' }))

    expect(tooltipOf('表を挿入')).toBeNull()
  })

  it('Apple の環境では、最初の描画から ⌘ のショートカットを伝える', async () => {
    vi.spyOn(navigator, 'platform', 'get').mockReturnValue('MacIntel')
    // 判定はモジュールに覚えられるため、前のテストで覚えた値を引き継がないよう読み直す
    vi.resetModules()
    const { ToolbarButton: FreshToolbarButton } = await import('./ToolbarButton')
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
    )

    expect(firstCommitShortcuts).toEqual(['Meta+B'])
  })

  it('サーバーでの描画では Ctrl のショートカットを伝える', () => {
    const html = renderToString(<ToolbarButton shortcut="Mod-B" icon={null} label="太字" />)

    expect(html).toContain('aria-keyshortcuts="Control+B"')
  })
})
