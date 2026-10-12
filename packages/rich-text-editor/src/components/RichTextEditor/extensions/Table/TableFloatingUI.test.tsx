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
const SECOND_TABLE_RECT = new DOMRect(30, 400, 300, 120)

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement,
  ) {
    if (this instanceof HTMLTableElement || this.classList.contains('tableWrapper')) {
      return this.textContent?.includes('C1') ? SECOND_TABLE_RECT : TABLE_RECT
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

    it('同じ表の中でキャレットを動かしても、帯の追加ボタンを消さない', async () => {
      await renderTable()
      placeCaretIn('A1')
      hover(TABLE_RECT.right + 10, 100)
      await screen.findByRole('button', { name: ADD_COLUMN })

      placeCaretIn('A2')

      expect(screen.getByRole('button', { name: ADD_COLUMN })).toBeInTheDocument()
    })

    it('帯の追加ボタンは、ポインターを動かさずに続けて押せる', async () => {
      await renderTable()
      hover(100, TABLE_RECT.bottom + 10)

      fireEvent.click(await screen.findByRole('button', { name: ADD_ROW }))
      fireEvent.click(await screen.findByRole('button', { name: ADD_ROW }))

      expect(countRows()).toBe(5)
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

  describe('表が複数あるとき・表の前を編集したとき', () => {
    const tableOf = (prefix: string) => ({
      type: 'table',
      content: [1, 2].map((row) => ({
        type: 'tableRow',
        content: [`${prefix}${row}`].map((text) => ({
          type: 'tableCell',
          content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
        })),
      })),
    })
    const paragraphOf = (text: string) => ({
      type: 'paragraph',
      content: [{ type: 'text', text }],
    })
    const renderDoc = async (content: RichTextJSON['content'], lastText: string) => {
      render(<RichTextEditor defaultValue={{ type: 'doc', content }} features={['table']} />, {
        wrapper: Wrapper,
      })
      await waitFor(() => expect(screen.getByText(lastText)).toBeInTheDocument())
    }
    const rowCounts = () =>
      Array.from(document.querySelectorAll('.ProseMirror table')).map(
        (table) => table.querySelectorAll('tr').length,
      )
    const hoverBelowFirstTable = async () => {
      fireEvent.mouseMove(screen.getByRole('textbox'), {
        clientX: 100,
        clientY: TABLE_RECT.bottom + 10,
      })
      await act(() => new Promise((resolve) => requestAnimationFrame(resolve)))
    }

    it('ポインターが別の表に重なったままでも、キャレットを移した表に追加ボタンを出し、その表で入力しても移さない', async () => {
      await renderDoc([tableOf('A'), tableOf('C')], 'C2')
      placeCaretIn('A1')
      fireEvent.mouseMove(screen.getByText('A1'), { clientX: 100, clientY: 60 })
      await act(() => new Promise((resolve) => requestAnimationFrame(resolve)))

      placeCaretIn('C2')
      act(() => {
        getEditor().commands.insertContent('追記')
      })

      fireEvent.click(await screen.findByRole('button', { name: ADD_ROW }))
      expect(rowCounts()).toEqual([2, 3])
    })

    it('キャレットのある表とは別の表にあとからポインターを重ねても、キャレットの表に追加ボタンを出す', async () => {
      await renderDoc([tableOf('A'), tableOf('C')], 'C2')
      placeCaretIn('C2')

      fireEvent.mouseMove(screen.getByText('A1'), { clientX: 100, clientY: 60 })
      await act(() => new Promise((resolve) => requestAnimationFrame(resolve)))

      fireEvent.click(await screen.findByRole('button', { name: ADD_ROW }))
      expect(rowCounts()).toEqual([2, 3])
    })

    it('帯で前の表に行を足したあと、キャレットを後ろの表へ移すと、後ろの表に追加ボタンを出す', async () => {
      await renderDoc([tableOf('A'), tableOf('C')], 'C2')
      placeCaretIn('C1')
      await hoverBelowFirstTable()
      fireEvent.click(await screen.findByRole('button', { name: ADD_ROW }))
      expect(rowCounts()).toEqual([3, 2])

      placeCaretIn('C2')

      fireEvent.click(await screen.findByRole('button', { name: ADD_ROW }))
      expect(rowCounts()).toEqual([3, 3])
    })

    it('ポインター下の表が削除されたら、後ろの表へ帯の追加ボタンを移さない', async () => {
      await renderDoc([paragraphOf('前'), tableOf('A'), tableOf('C')], 'C2')
      placeCaretIn('前')
      await hoverBelowFirstTable()
      await screen.findByRole('button', { name: ADD_ROW })

      act(() => {
        const { doc } = getEditor().state
        const from = doc.firstChild!.nodeSize
        getEditor().commands.deleteRange({ from, to: from + doc.child(1).nodeSize })
      })

      expect(screen.queryByText('A1')).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: ADD_ROW })).not.toBeInTheDocument()
    })

    it('表の前を編集して位置がずれても、帯の追加ボタンはポインター下の表に行を足す', async () => {
      await renderDoc([paragraphOf('前'), tableOf('A')], 'A2')
      placeCaretIn('前')
      await hoverBelowFirstTable()
      await screen.findByRole('button', { name: ADD_ROW })

      act(() => {
        getEditor().commands.insertContentAt(1, '追記')
      })

      fireEvent.click(await screen.findByRole('button', { name: ADD_ROW }))
      expect(rowCounts()).toEqual([3])
    })
  })
})
