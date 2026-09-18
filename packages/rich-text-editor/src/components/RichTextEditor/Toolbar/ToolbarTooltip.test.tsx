import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EnvironmentProvider } from 'smarthr-ui'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import { ToolbarTooltip } from './ToolbarTooltip'

import type { ComponentProps, ReactNode } from 'react'

// クリップされた・戻ったをテストから通知できるよう、コールバックを握るモックに差し替える
const intersectionCallbacks: Array<(entries: Array<{ isIntersecting: boolean }>) => void> = []

beforeAll(() => {
  globalThis.IntersectionObserver = class {
    private callback: (entries: Array<{ isIntersecting: boolean }>) => void

    constructor(callback: (entries: Array<{ isIntersecting: boolean }>) => void) {
      this.callback = callback
      intersectionCallbacks.push(callback)
    }

    observe() {}

    unobserve() {}

    disconnect() {
      const index = intersectionCallbacks.indexOf(this.callback)

      if (index >= 0) intersectionCallbacks.splice(index, 1)
    }

    takeRecords() {
      return []
    }
  } as unknown as typeof IntersectionObserver
})

const fireIntersection = (isIntersecting: boolean) => {
  act(() => {
    intersectionCallbacks.forEach((callback) => callback([{ isIntersecting }]))
  })
}

const renderTooltip = (props: Partial<ComponentProps<typeof ToolbarTooltip>> = {}) =>
  render(
    <ToolbarTooltip {...props} shortcut="Mod-B" label="太字">
      <button type="button">太字</button>
    </ToolbarTooltip>,
  )

const tooltipOf = (label: string) =>
  screen.queryAllByText(label).find((el) => el.tagName === 'SPAN') ?? null

describe('ToolbarTooltip', () => {
  it('ホバーするまでツールチップを描画しない', async () => {
    renderTooltip()

    expect(tooltipOf('太字')).toBeNull()
  })

  it('ホバーするとラベルとショートカットキーを表示する', async () => {
    renderTooltip()

    await userEvent.hover(screen.getByRole('button'))

    expect(tooltipOf('太字')).not.toBeNull()
    expect(screen.getByText('B')).toBeInTheDocument()
  })

  it('ホバーを外すとツールチップを消す', async () => {
    renderTooltip()

    await userEvent.hover(screen.getByRole('button'))
    await userEvent.unhover(screen.getByRole('button'))

    expect(tooltipOf('太字')).toBeNull()
  })

  it('フォーカスするとツールチップを表示し、外れると消す', async () => {
    renderTooltip()

    await userEvent.tab()
    expect(tooltipOf('太字')).not.toBeNull()

    await userEvent.tab()
    expect(tooltipOf('太字')).toBeNull()
  })

  it('フォーカスが残っているあいだは、ホバーを外してもツールチップを消さない', async () => {
    renderTooltip()

    await userEvent.tab()
    await userEvent.hover(screen.getByRole('button'))
    await userEvent.unhover(screen.getByRole('button'))

    expect(tooltipOf('太字')).not.toBeNull()
  })

  it('suppressed のときはホバーしても表示しない', async () => {
    renderTooltip({ suppressed: true })

    await userEvent.hover(screen.getByRole('button'))

    expect(tooltipOf('太字')).toBeNull()
  })

  it('mobile のときはホバーしても表示しない', async () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <EnvironmentProvider environment={{ mobile: true }}>{children}</EnvironmentProvider>
    )

    render(
      <ToolbarTooltip shortcut="Mod-B" label="太字">
        <button type="button">太字</button>
      </ToolbarTooltip>,
      { wrapper },
    )

    await userEvent.hover(screen.getByRole('button'))

    expect(tooltipOf('太字')).toBeNull()
  })

  it('クリップされて見えなくなったら消し、見える位置へ戻ったら再表示する', async () => {
    renderTooltip()

    await userEvent.hover(screen.getByRole('button'))
    expect(tooltipOf('太字')).not.toBeNull()

    fireIntersection(false)

    await waitFor(() => expect(tooltipOf('太字')).toBeNull())

    fireIntersection(true)

    await waitFor(() => expect(tooltipOf('太字')).not.toBeNull())
  })

  it('suppressed になるとツールチップを消し、毎フレームの測り直しも止める', async () => {
    const { rerender } = render(
      <ToolbarTooltip shortcut="Mod-B" label="太字">
        <button type="button">太字</button>
      </ToolbarTooltip>,
    )

    await userEvent.hover(screen.getByRole('button'))
    expect(tooltipOf('太字')).not.toBeNull()

    const requestFrame = vi.spyOn(globalThis, 'requestAnimationFrame')

    rerender(
      <ToolbarTooltip suppressed shortcut="Mod-B" label="太字">
        <button type="button">太字</button>
      </ToolbarTooltip>,
    )

    expect(tooltipOf('太字')).toBeNull()

    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(requestFrame).not.toHaveBeenCalled()

    requestFrame.mockRestore()
  })

  it('トリガーを囲む要素の外側にツールチップを描画する', async () => {
    const { container } = render(
      <ToolbarTooltip shortcut="Mod-B" label="太字">
        <button type="button">太字</button>
      </ToolbarTooltip>,
    )

    await userEvent.hover(screen.getByRole('button'))

    const tooltip = tooltipOf('太字')

    expect(tooltip).not.toBeNull()
    expect(container.contains(tooltip)).toBe(false)
  })
})
