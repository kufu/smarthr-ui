import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createElement, memo } from 'react'
import { IntlProvider } from 'smarthr-ui'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import { RichTextEditor } from '../RichTextEditor/RichTextEditor'

import type { Editor } from '@tiptap/core'
import type { FC, ReactNode } from 'react'

const rendered = vi.hoisted(() => ({ labels: [] as string[], dropdowns: [] as string[] }))

// memo が効いていれば、props が変わらないボタンはこの包みごと描画されない
vi.mock('../Toolbar/ToolbarButton', async (importOriginal) => {
  const actual = (await importOriginal()) as { ToolbarButton: FC<{ label: string }> }

  return {
    ...actual,
    ToolbarButton: memo((props: { label: string }) => {
      rendered.labels.push(props.label)

      return createElement(actual.ToolbarButton, props)
    }),
  }
})

// ドロップダウンは props が変わったときだけ包みごと描画される。vi.mock は巻き上げられるため hoisted に置く
const { trackDropdown } = vi.hoisted(() => ({
  trackDropdown:
    (name: string, exportName: string) => async (importOriginal: () => Promise<unknown>) => {
      const { createElement: h, memo: m } = await import('react')
      const actual = (await importOriginal()) as Record<string, FC>

      return {
        ...actual,
        [exportName]: m((props: object) => {
          rendered.dropdowns.push(name)

          return h(actual[exportName], props)
        }),
      }
    },
}))

vi.mock('../Toolbar/HeadingDropdown', (importOriginal) =>
  trackDropdown('heading', 'HeadingDropdown')(importOriginal),
)
vi.mock('../Toolbar/FontSizeDropdown', (importOriginal) =>
  trackDropdown('fontSize', 'FontSizeDropdown')(importOriginal),
)
vi.mock('../Toolbar/ColorPicker/ColorPickerButton', (importOriginal) =>
  trackDropdown('color', 'ColorPickerButton')(importOriginal),
)

beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
})

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">{children}</IntlProvider>
)

const renderEditor = async () => {
  render(
    <RichTextEditor
      features={[
        'bold',
        'italic',
        'strike',
        'underline',
        'bulletList',
        'heading',
        'fontSize',
        'color',
      ]}
      content={{ format: 'html', content: '<p>普通 <strong>太字</strong></p>' }}
    />,
    { wrapper: Wrapper },
  )
  await waitFor(() => expect(screen.getByRole('toolbar')).toBeInTheDocument())

  return (document.querySelector('.ProseMirror') as HTMLElement & { editor: Editor }).editor
}

describe('ツールバーの roving tabindex', () => {
  it('ツールバーの状態が変わっても、ドロップダウンは描画し直さない', async () => {
    const editor = await renderEditor()
    act(() => {
      editor.commands.setTextSelection(2)
    })
    rendered.dropdowns = []

    act(() => {
      editor.commands.setTextSelection(6)
    })

    expect(screen.getByRole('button', { name: '太字' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /^書式:/ })).toBeInTheDocument()
    expect(rendered.dropdowns).toEqual([])
  })

  it('矢印キーで移動しても、描画し直すのはフォーカスの移動元と移動先だけ', async () => {
    await renderEditor()
    act(() => screen.getByRole('button', { name: '太字' }).focus())
    rendered.labels = []
    rendered.dropdowns = []

    await userEvent.keyboard('{ArrowRight}')

    expect(screen.getByRole('button', { name: '斜体' })).toHaveFocus()
    expect([...rendered.labels].sort()).toEqual(['太字', '斜体'].sort())
    expect(rendered.dropdowns).toEqual([])
  })
})
