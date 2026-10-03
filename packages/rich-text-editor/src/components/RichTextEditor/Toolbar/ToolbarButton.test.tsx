import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, describe, expect, it } from 'vitest'

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
})
