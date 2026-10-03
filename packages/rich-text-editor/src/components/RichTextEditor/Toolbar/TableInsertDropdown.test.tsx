import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IntlProvider } from 'smarthr-ui'
import { describe, expect, it } from 'vitest'

import { RichTextEditor } from '../RichTextEditor/RichTextEditor'

import type { ReactNode } from 'react'

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">{children}</IntlProvider>
)

const insertTable = async (rows: string, cols: string) => {
  const user = userEvent.setup()
  render(<RichTextEditor features={['table']} />, { wrapper: Wrapper })
  await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())

  await user.click(screen.getByRole('button', { name: 'テーブルを挿入' }))
  const rowsInput = screen.getByRole('spinbutton', { name: '行数' })
  const colsInput = screen.getByRole('spinbutton', { name: '列数' })
  await waitFor(() => expect(rowsInput).toHaveFocus())

  await user.clear(rowsInput)
  await user.type(rowsInput, rows)
  await user.clear(colsInput)
  await user.type(colsInput, cols)
  await user.click(screen.getByRole('button', { name: '挿入' }))
}

const insertedTable = () => document.querySelector('.ProseMirror table')

describe('TableInsertDropdown の行数・列数', () => {
  it('上限ちょうどの表は挿入できる', async () => {
    await insertTable('100', '20')

    await waitFor(() => expect(insertedTable()).not.toBeNull())
    expect(insertedTable()!.querySelectorAll('tr')).toHaveLength(100)
    expect(insertedTable()!.querySelector('tr')!.children).toHaveLength(20)
  })

  it.each([
    ['行数が上限を超える場合', '101', '3'],
    ['列数が上限を超える場合', '3', '21'],
    ['桁を打ち間違えた場合', '10000', '3'],
    ['0 の場合', '0', '3'],
    ['行数が小数の場合', '1.5', '3'],
    ['列数が小数の場合', '3', '2.5'],
    ['指数表記で上限を超える場合', '1e3', '3'],
  ])('%sは挿入せず、範囲をエラーで伝える', async (_, rows, cols) => {
    await insertTable(rows, cols)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '行数は1〜100、列数は1〜20の整数を入力してください',
    )
    expect(insertedTable()).toBeNull()
  })

  it('入力欄に範囲を持たせる', async () => {
    const user = userEvent.setup()
    render(<RichTextEditor features={['table']} />, { wrapper: Wrapper })
    await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())
    await user.click(screen.getByRole('button', { name: 'テーブルを挿入' }))

    const rowsInput = screen.getByRole('spinbutton', { name: '行数' })
    const colsInput = screen.getByRole('spinbutton', { name: '列数' })

    expect(rowsInput).toHaveAttribute('min', '1')
    expect(rowsInput).toHaveAttribute('max', '100')
    expect(colsInput).toHaveAttribute('min', '1')
    expect(colsInput).toHaveAttribute('max', '20')
  })
})
