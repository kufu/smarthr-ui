import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { IntlProvider } from 'smarthr-ui'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { RichTextEditor } from '../../RichTextEditor/RichTextEditor'

import type { RichTextJSON } from '../../types'
import type { TiptapEditorHTMLElement } from '@tiptap/core'
import type { ReactNode } from 'react'

beforeAll(() => {
  if (typeof globalThis.ResizeObserver === 'undefined') {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  }
})

// jsdom はレイアウトを計算しないため、表だけに位置と大きさを与える
const TABLE_RECT = new DOMRect(30, 40, 300, 120)

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement,
  ) {
    if (this instanceof HTMLTableElement || this.classList.contains('tableWrapper')) {
      return TABLE_RECT
    }

    return new DOMRect(0, 0, 1000, 800)
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">{children}</IntlProvider>
)

const tableDoc: RichTextJSON = {
  type: 'doc',
  content: [
    {
      type: 'table',
      content: [
        ['A1', 'B1'],
        ['A2', 'B2'],
        ['A3', 'B3'],
      ].map((cells) => ({
        type: 'tableRow',
        content: cells.map((text) => ({
          type: 'tableCell',
          content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
        })),
      })),
    },
  ],
}

const getEditor = () => (screen.getByRole('textbox') as TiptapEditorHTMLElement).editor!

const renderTable = async () => {
  render(<RichTextEditor defaultValue={tableDoc} features={['table']} />, { wrapper: Wrapper })
  await waitFor(() => expect(screen.getByText('A1')).toBeInTheDocument())
}

const placeCaretIn = (text: string) => {
  const editor = getEditor()

  act(() => {
    editor.commands.setTextSelection(editor.view.posAtDOM(screen.getByText(text), 0))
  })
}

const countRows = () => document.querySelectorAll('.ProseMirror tr').length
const countColumns = () => document.querySelector('.ProseMirror tr')?.children.length

const ADD_ROW = '行を下に追加'
const ADD_COLUMN = '列を右に追加'

describe('表の行・列の追加ボタン', () => {
  it('中ほどのセルにキャレットがあるときは出さない', async () => {
    await renderTable()
    // 出ている状態から移し、表示が更新されたうえで消えることを確かめる
    placeCaretIn('B3')
    await screen.findByRole('button', { name: ADD_ROW })
    await screen.findByRole('button', { name: ADD_COLUMN })

    placeCaretIn('A2')

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: ADD_ROW })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: ADD_COLUMN })).not.toBeInTheDocument()
    })
  })

  it('最後の行にキャレットがあると行の追加ボタンを出し、押すと行が増える', async () => {
    await renderTable()

    placeCaretIn('A3')

    const addRow = await screen.findByRole('button', { name: ADD_ROW })
    expect(screen.queryByRole('button', { name: ADD_COLUMN })).not.toBeInTheDocument()
    fireEvent.click(addRow)

    expect(countRows()).toBe(4)
  })

  it('最後の列にキャレットがあると列の追加ボタンを出し、押すと列が増える', async () => {
    await renderTable()

    placeCaretIn('B2')

    const addColumn = await screen.findByRole('button', { name: ADD_COLUMN })
    expect(screen.queryByRole('button', { name: ADD_ROW })).not.toBeInTheDocument()
    fireEvent.click(addColumn)

    expect(countColumns()).toBe(3)
  })

  describe('ポインターを表の外側に重ねたとき', () => {
    const hover = (clientX: number, clientY: number) =>
      fireEvent.mouseMove(screen.getByRole('textbox'), { clientX, clientY })

    it('下の帯では行の、右の帯では列の追加ボタンを出す', async () => {
      await renderTable()

      hover(100, TABLE_RECT.bottom + 10)
      expect(await screen.findByRole('button', { name: ADD_ROW })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: ADD_COLUMN })).not.toBeInTheDocument()

      hover(TABLE_RECT.right + 10, 100)
      expect(await screen.findByRole('button', { name: ADD_COLUMN })).toBeInTheDocument()
      await waitFor(() =>
        expect(screen.queryByRole('button', { name: ADD_ROW })).not.toBeInTheDocument(),
      )
    })

    it('帯から離れると消す', async () => {
      await renderTable()
      hover(100, TABLE_RECT.bottom + 10)
      await screen.findByRole('button', { name: ADD_ROW })

      hover(100, TABLE_RECT.bottom + 200)

      await waitFor(() =>
        expect(screen.queryByRole('button', { name: ADD_ROW })).not.toBeInTheDocument(),
      )
    })
  })
})
