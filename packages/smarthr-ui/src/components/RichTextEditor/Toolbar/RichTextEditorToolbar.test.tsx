import { render, screen, waitFor, within } from '@testing-library/react'
import { beforeAll, describe, expect, it } from 'vitest'

import { IntlProvider } from '../../../intl'
import { RichTextEditor } from '../RichTextEditor/RichTextEditor'

import type { RichTextFeature } from '../types'
import type { ReactNode } from 'react'

beforeAll(() => {
  if (typeof globalThis.ResizeObserver === 'undefined') {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver
  }
})

const ALL_FEATURES: RichTextFeature[] = [
  'bold',
  'italic',
  'strike',
  'underline',
  'code',
  'codeBlock',
  'bulletList',
  'orderedList',
  'blockquote',
  'horizontalRule',
  'link',
  'heading',
  'color',
  'backgroundColor',
  'fontSize',
  'lineHeight',
  'textAlign',
  'image',
  'youtube',
  'table',
]

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">{children}</IntlProvider>
)

const renderEditor = async () => {
  render(<RichTextEditor features={ALL_FEATURES} />, { wrapper: Wrapper })
  await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())
}

const heightClassNamesOf = (el: HTMLElement) =>
  Array.from(el.classList).filter((className) => /^shr-h-/.test(className))

describe('RichTextEditorToolbar', () => {
  it('ツールバーの操作要素のクリック領域の高さが全項目で揃っている', async () => {
    await renderEditor()

    const items = within(screen.getByRole('toolbar')).getAllByRole('button')
    expect(items.length).toBe(ALL_FEATURES.length + 2) // features + 履歴操作（元に戻す・やり直す）

    const heightClassNames = items.map((item) => heightClassNamesOf(item))
    // 高さを明示していないと利用側の line-height でクリック領域の高さが変わるため、全項目で高さを固定する
    expect(heightClassNames.every((classNames) => classNames.length === 1)).toBe(true)
    expect(new Set(heightClassNames.map(([className]) => className)).size).toBe(1)
  })
})
