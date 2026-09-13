import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Editor } from '@tiptap/core'
import { TableCell, TableHeader, TableRow } from '@tiptap/extension-table'
import StarterKit from '@tiptap/starter-kit'
import { IntlProvider } from 'smarthr-ui'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { CellAppearance } from './CellAppearance'
import { CustomTable } from './CustomTable'
import { TableCellControls } from './TableCellControls'
import { getTableTarget } from './tableTarget'

let editor: Editor
let container: HTMLDivElement
let offscreen = false
let horizontalOffset = 0
const originalElementFromPoint = document.elementFromPoint
const originalScrollIntoView = HTMLElement.prototype.scrollIntoView
const scrollIntoView = vi.fn(() => {
  offscreen = false
  window.dispatchEvent(new Event('scroll'))
})

beforeEach(() => {
  offscreen = false
  horizontalOffset = 0
  scrollIntoView.mockClear()
  Object.defineProperty(document, 'elementFromPoint', { configurable: true, value: () => null })
  HTMLElement.prototype.scrollIntoView = scrollIntoView
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement,
  ) {
    if (this instanceof HTMLTableCellElement) {
      const row = this.parentElement as HTMLTableRowElement
      return new DOMRect(
        30 + this.cellIndex * 100 - horizontalOffset,
        (offscreen ? 700 : 40) + row.rowIndex * 40,
        100,
        40,
      )
    }
    if (this instanceof HTMLTableElement || this.classList.contains('tableWrapper'))
      return new DOMRect(30, 40, 300, 120)
    return new DOMRect(0, 0, 500, 400)
  })
  container = document.createElement('div')
  document.body.appendChild(container)
  const element = document.createElement('div')
  container.appendChild(element)
  editor = new Editor({
    element,
    extensions: [
      StarterKit,
      CustomTable.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      CellAppearance,
    ],
  })
  editor.commands.insertTable({ rows: 3, cols: 3, withHeaderRow: false })
  const target = getTableTarget(editor)!
  editor.commands.setTextSelection(target.tablePos + 1 + target.map.map[4] + 2)
})

afterEach(() => {
  cleanup()
  editor.destroy()
  container.remove()
  HTMLElement.prototype.scrollIntoView = originalScrollIntoView
  Object.defineProperty(document, 'elementFromPoint', {
    configurable: true,
    value: originalElementFromPoint,
  })
  vi.restoreAllMocks()
})

const showControls = () =>
  render(
    <IntlProvider locale="ja">
      <TableCellControls
        containerRef={{ current: container }}
        editor={editor}
        features={['table', 'color', 'backgroundColor']}
      />
    </IntlProvider>,
  )

describe('table controls', () => {
  it('keeps handles at the clicked cell while a column menu is open and colors only that column', async () => {
    const user = userEvent.setup()
    const originalPos = getTableTarget(editor)!.pos
    showControls()
    const row = screen.getByRole('button', { name: '行の操作' })
    const column = screen.getByRole('button', { name: '列の操作' })
    const rowTop = row.style.top
    const columnLeft = column.style.left
    await user.click(column)
    expect(row.style.top).toBe(rowTop)
    expect(column.style.left).toBe(columnLeft)
    await user.click(screen.getByRole('button', { name: 'カラー' }))
    const palette = within(screen.getByRole('group', { name: '背景色' }))
    await user.click(palette.getByRole('button', { name: '赤' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(getTableTarget(editor)!.pos).toBe(originalPos)
    getTableTarget(editor)!.table.forEach((tableRow) =>
      tableRow.forEach((cell, _offset, index) => {
        expect(cell.attrs.backgroundColor).toBe(index === 1 ? '#fde2ea' : null)
      }),
    )
  })

  it('keeps a scrollable menu open while its own content scrolls', async () => {
    showControls()
    await userEvent.click(screen.getByRole('button', { name: '列の操作' }))
    const dialog = screen.getByRole('dialog', { name: '列の操作' })
    fireEvent.scroll(dialog.parentElement!)
    expect(dialog).toBeInTheDocument()
    fireEvent.scroll(window)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('offers both header settings from the table menu at any cell', async () => {
    const user = userEvent.setup()
    showControls()
    await user.click(screen.getByRole('button', { name: '表の操作' }))
    expect(screen.getByRole('button', { name: '最初の列をヘッダーにする' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '最初の行をヘッダーにする' }))
    expect(getTableTarget(editor)!.table.firstChild!.firstChild!.type.name).toBe('tableHeader')
    expect(getTableTarget(editor)!.table.child(1).firstChild!.type.name).toBe('tableCell')
  })

  it.each(['行', '列', '表', 'セル'])(
    'supports keyboard opening and navigation for %s actions',
    async (scope) => {
      const user = userEvent.setup()
      showControls()
      const trigger = screen.getByRole('button', { name: `${scope}の操作` })
      trigger.focus()
      await user.keyboard('{ArrowDown}')
      const dialog = await screen.findByRole('dialog', { name: `${scope}の操作` })
      const buttons = within(dialog)
        .getAllByRole('button')
        .filter((button) => !(button as HTMLButtonElement).disabled)
      await waitFor(() => expect(buttons[0]).toHaveFocus())
      await user.keyboard('{End}')
      expect(buttons.at(-1)).toHaveFocus()
      await user.keyboard('{ArrowDown}')
      expect(buttons[0]).toHaveFocus()
      await user.keyboard('{Escape}')
      expect(trigger).toHaveFocus()
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      await user.keyboard('{ArrowUp}')
      await waitFor(() =>
        expect(within(screen.getByRole('dialog')).getAllByRole('button').at(-1)).toHaveFocus(),
      )
    },
  )

  it('moves focus into colors and returns to the color item with Escape', async () => {
    const user = userEvent.setup()
    showControls()
    screen.getByRole('button', { name: '列の操作' }).focus()
    await user.keyboard('{Enter}')
    const color = await screen.findByRole('button', { name: 'カラー' })
    await waitFor(() =>
      expect(within(screen.getByRole('dialog')).getAllByRole('button')[0]).toHaveFocus(),
    )
    color.focus()
    await user.keyboard('{ArrowRight}')
    await waitFor(() => expect(screen.getByRole('button', { name: '操作に戻る' })).toHaveFocus())
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.getByRole('button', { name: 'カラー' })).toHaveFocus())
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.getByRole('button', { name: '列の操作' })).toHaveFocus()
  })

  it.each([
    { scope: 'table', label: '表', key: 'T', code: 'KeyT' },
    { scope: 'column', label: '列', key: 'C', code: 'KeyC' },
    { scope: 'row', label: '行', key: 'R', code: 'KeyR' },
  ])('opens $scope actions directly from the cell shortcut', async ({ label, key, code }) => {
    showControls()
    fireEvent.keyDown(editor.view.dom, { key, code, altKey: true, shiftKey: true })
    const dialog = await screen.findByRole('dialog', { name: `${label}の操作` })
    await waitFor(() => expect(within(dialog).getAllByRole('button')[0]).toHaveFocus())
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('toggles only the selected cell header and preserves its contents', async () => {
    const user = userEvent.setup()
    editor.commands.insertContent('Heading')
    const pos = getTableTarget(editor)!.pos
    showControls()
    await user.click(screen.getByRole('button', { name: 'セルの操作' }))
    await user.click(screen.getByRole('button', { name: 'ヘッダーセルにする' }))
    expect(editor.state.doc.nodeAt(pos)?.type.name).toBe('tableHeader')
    expect(editor.state.doc.nodeAt(pos)?.textContent).toBe('Heading')
    expect(getTableTarget(editor)!.table.firstChild!.firstChild!.type.name).toBe('tableCell')
    await user.click(screen.getByRole('button', { name: 'セルの操作' }))
    await user.click(screen.getByRole('button', { name: '通常のセルに戻す' }))
    expect(editor.state.doc.nodeAt(pos)?.type.name).toBe('tableCell')
  })

  it.each(['行', '列'])(
    'toggles the selected middle %s header without changing the first one',
    async (scope) => {
      const user = userEvent.setup()
      showControls()
      await user.click(screen.getByRole('button', { name: `${scope}の操作` }))
      await user.click(screen.getByRole('button', { name: `${scope}をヘッダーにする` }))
      const table = getTableTarget(editor)!.table
      expect(table.child(1).child(1).type.name).toBe('tableHeader')
      expect(table.child(0).child(0).type.name).toBe('tableCell')
      expect(table.child(scope === '行' ? 1 : 0).child(scope === '行' ? 0 : 1).type.name).toBe(
        'tableHeader',
      )
      await user.click(screen.getByRole('button', { name: `${scope}の操作` }))
      expect(screen.getByRole('button', { name: `${scope}をヘッダーにする` })).toHaveAttribute(
        'aria-pressed',
        'true',
      )
      await user.click(screen.getByRole('button', { name: `${scope}をヘッダーにする` }))
      expect(getTableTarget(editor)!.table.child(1).child(1).type.name).toBe('tableCell')
    },
  )

  it('keeps selection actions available when the anchor cell is scrolled out', async () => {
    const user = userEvent.setup()
    const target = getTableTarget(editor)!
    editor.commands.setCellSelection({
      anchorCell: target.tablePos + 1 + target.map.map[0],
      headCell: target.tablePos + 1 + target.map.map[2],
    })
    showControls()
    horizontalOffset = 100
    fireEvent.scroll(window)
    await user.click(screen.getByRole('button', { name: 'セルの操作' }))
    await user.click(screen.getByRole('button', { name: 'セルを結合' }))
    expect(getTableTarget(editor)!.table.firstChild!.firstChild!.attrs.colspan).toBe(3)
  })

  it('checks the palette color after loading cell colors from HTML', async () => {
    const user = userEvent.setup()
    editor.commands.setContent(
      '<table><tr><td style="color: rgb(0, 119, 199); background-color: rgb(253, 226, 234)"><p>Blue</p></td></tr></table>',
    )
    editor.commands.setTextSelection(4)
    showControls()
    await user.click(screen.getByRole('button', { name: 'セルの操作' }))
    await user.click(screen.getByRole('button', { name: 'カラー' }))
    expect(
      within(screen.getByRole('group', { name: '文字色' })).getByRole('button', { name: '青' }),
    ).toHaveAttribute('aria-pressed', 'true')
    expect(
      within(screen.getByRole('group', { name: '背景色' })).getByRole('button', { name: '赤' }),
    ).toHaveAttribute('aria-pressed', 'true')
  })

  it('preserves a multiple cell selection when opening its action button', async () => {
    const user = userEvent.setup()
    const table = getTableTarget(editor)!
    editor.commands.setCellSelection({
      anchorCell: table.tablePos + 1 + table.map.map[4],
      headCell: table.tablePos + 1 + table.map.map[5],
    })
    showControls()
    fireEvent.mouseMove(editor.view.dom.querySelectorAll('td')[5])
    await user.click(screen.getByRole('button', { name: 'セルの操作' }))
    await user.click(screen.getByRole('button', { name: 'セルを結合' }))
    expect(getTableTarget(editor)!.table.child(1).child(1).attrs.colspan).toBe(2)
  })

  it.each([
    { scope: '行', width: 3, height: 2 },
    { scope: '列', width: 2, height: 3 },
  ])('deletes only the selected $scope', async ({ scope, width, height }) => {
    showControls()
    await userEvent.click(screen.getByRole('button', { name: `${scope}の操作` }))
    await userEvent.click(screen.getByRole('button', { name: `${scope}を削除` }))
    expect(getTableTarget(editor)!.map).toMatchObject({ width, height })
    act(() => {
      editor.commands.undo()
    })
    expect(getTableTarget(editor)!.map).toMatchObject({ width: 3, height: 3 })
  })

  it('opens keyboard actions after revealing a selected cell outside the viewport', async () => {
    offscreen = true
    showControls()
    expect(screen.queryByRole('button', { name: 'セルの操作' })).not.toBeInTheDocument()
    expect(editor.storage.table?.openActionsMenu).toBeTypeOf('function')
    act(() => editor.storage.table?.openActionsMenu?.())
    const dialog = await screen.findByRole('dialog', { name: 'セルの操作' })
    await waitFor(() =>
      expect(within(dialog).getByRole('button', { name: 'ヘッダーセルにする' })).toHaveFocus(),
    )
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest', inline: 'nearest' })
    const user = userEvent.setup()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(getTableTarget(editor)!.rect).toMatchObject({ top: 1, left: 1 })
  })
})

describe('操作メニューのキーボードショートカット', () => {
  // macOS の Option+Shift+英字は別の文字を生むため、event.key だけでは照合できない。
  const cases = [
    { platform: 'macOS', key: 'Ç', keyCode: 67, shiftKey: true, name: '列の操作' },
    { platform: 'Windows', key: 'C', keyCode: 67, shiftKey: true, name: '列の操作' },
    { platform: 'macOS', key: 'Â', keyCode: 82, shiftKey: true, name: '行の操作' },
    { platform: 'Windows', key: 'R', keyCode: 82, shiftKey: true, name: '行の操作' },
    { platform: 'macOS', key: 'ˆ', keyCode: 84, shiftKey: true, name: '表の操作' },
    { platform: 'Windows', key: 'T', keyCode: 84, shiftKey: true, name: '表の操作' },
    { platform: '共通', key: 'Enter', keyCode: 13, shiftKey: false, name: 'セルの操作' },
  ]

  it.each(cases)(
    '$platform の $key で「$name」が開く',
    async ({ key, keyCode, shiftKey, name }) => {
      showControls()
      act(() => {
        fireEvent.keyDown(editor.view.dom, { altKey: true, key, keyCode, shiftKey, which: keyCode })
      })
      expect(await screen.findByRole('dialog', { name })).toBeInTheDocument()
    },
  )
})
