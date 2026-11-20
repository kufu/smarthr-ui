import { render, screen, waitFor } from '@testing-library/react'
import { createRef } from 'react'

import { BulkActionRow } from './BulkActionRow'
import { EmptyTableBody } from './EmptyTableBody'
import { Table } from './Table'
import { Th } from './Th'

describe('Table', () => {
  test.each([true, false])('reel=%sのときrefがtable要素にアタッチされる', (reel) => {
    const ref = createRef<HTMLTableElement>()

    render(
      <Table ref={ref} reel={reel}>
        <tbody>
          <tr>
            <td>test</td>
          </tr>
        </tbody>
      </Table>,
    )

    expect(ref.current).toBeInstanceOf(HTMLTableElement)
  })

  describe('自動で colspan を設定するセル', () => {
    const createTable = (showExtraColumn: boolean, headerColSpan = 1, headKey = 'header') => (
      <Table reel={false}>
        <thead key={headKey}>
          <tr>
            <Th colSpan={headerColSpan}>名前</Th>
            {showExtraColumn && <Th>担当</Th>}
          </tr>
          <BulkActionRow>一括操作</BulkActionRow>
        </thead>
        <EmptyTableBody>データなし</EmptyTableBody>
      </Table>
    )

    const expectColSpan = (colSpan: string) => {
      expect(screen.getByRole('cell', { name: '一括操作' })).toHaveAttribute('colspan', colSpan)
      expect(screen.getByRole('cell', { name: 'データなし' })).toHaveAttribute('colspan', colSpan)
    }

    test('ヘッダーの列を追加・削除すると colspan が更新される', async () => {
      const { rerender } = render(createTable(false))
      expectColSpan('1')

      rerender(createTable(true))
      await waitFor(() => expectColSpan('2'))

      rerender(createTable(false))
      await waitFor(() => expectColSpan('1'))
    })

    test('thead を差し替えた後もヘッダーセルの colspan を反映する', async () => {
      const { rerender } = render(createTable(false))
      expectColSpan('1')

      rerender(createTable(false, 2, 'replacement'))
      await waitFor(() => expectColSpan('2'))

      rerender(createTable(false, 3, 'replacement'))
      await waitFor(() => expectColSpan('3'))
    })
  })

  describe('rounded', () => {
    const renderTable = (props: Partial<Parameters<typeof Table>[0]>) => {
      const ref = createRef<HTMLTableElement>()

      render(
        <Table {...props} ref={ref}>
          <tbody>
            <tr>
              <td>test</td>
            </tr>
          </tbody>
        </Table>,
      )

      return ref.current!.closest('.smarthr-ui-Scroller')!
    }

    test.each([
      [true, 'shr-rounded-l'],
      ['all', 'shr-rounded-l'],
      ['top', 'shr-rounded-t-l'],
      ['right', 'shr-rounded-r-l'],
      ['bottom', 'shr-rounded-b-l'],
      ['left', 'shr-rounded-l-l'],
    ] as const)('rounded=%sのときスクロール領域に%sが付与される', (rounded, className) => {
      expect(renderTable({ rounded })).toHaveClass(className)
    })

    test.each([
      { reel: true, fixedHead: false },
      { reel: false, fixedHead: false },
      { reel: true, fixedHead: true },
      { reel: false, fixedHead: true },
    ])('reel=$reel, fixedHead=$fixedHeadでもスクロール領域に角丸が付与される', (props) => {
      expect(renderTable({ ...props, rounded: true })).toHaveClass('shr-rounded-l')
    })

    test('roundedを指定しないときスクロール領域に角丸が付与されない', () => {
      expect(renderTable({}).className).not.toMatch(/shr-rounded/)
    })
  })
})
