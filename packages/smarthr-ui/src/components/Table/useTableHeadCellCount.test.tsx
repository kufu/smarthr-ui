import { render } from '@testing-library/react'

import { Table } from './Table'
import { Th } from './Th'
import { useTableHeadCellCount } from './useTableHeadCellCount'

import type { FC } from 'react'

describe('useTableHeadCellCount', () => {
  const TestComponentForTbody: FC = () => {
    const { countHeadCellRef, count } = useTableHeadCellCount<HTMLTableSectionElement>()

    return (
      <Table>
        <thead>
          <tr>
            <Th>表頭1</Th>
            <Th>表頭2</Th>
            <Th>表頭3</Th>
          </tr>
        </thead>
        <tbody ref={countHeadCellRef}>
          <tr>
            <td colSpan={count} data-testid="cell">
              カラム数: {count}
            </td>
          </tr>
        </tbody>
      </Table>
    )
  }

  it('単一行のヘッダーの場合にカラム数を正しくカウントすること', () => {
    const { getByTestId } = render(<TestComponentForTbody />)
    const cell = getByTestId('cell')

    expect(cell).toHaveTextContent('カラム数: 3')
    expect(cell).toHaveAttribute('colspan', '3')
  })

  it('複数行のヘッダーの場合にカラム数を正しくカウントすること', () => {
    const TestComponent: FC = () => {
      const { countHeadCellRef, count } = useTableHeadCellCount<HTMLTableSectionElement>()

      return (
        <Table>
          <thead>
            <tr>
              <Th rowSpan={2}>氏名</Th>
              <Th colSpan={2}>詳細情報</Th>
              <Th rowSpan={2}>アクション</Th>
            </tr>
            <tr>
              <Th>年齢</Th>
              <Th>部署</Th>
            </tr>
          </thead>
          <tbody ref={countHeadCellRef}>
            <tr>
              <td colSpan={count} data-testid="cell">
                カラム数: {count}
              </td>
            </tr>
          </tbody>
        </Table>
      )
    }

    const { getByTestId } = render(<TestComponent />)
    const cell = getByTestId('cell')

    // 1行目: 名前(colSpan=1) + 詳細情報(colSpan=2) + アクション(colSpan=1) = 4
    expect(cell).toHaveTextContent('カラム数: 4')
    expect(cell).toHaveAttribute('colspan', '4')
  })

  it('BulkActionRowがある場合にカラム数を正しくカウントすること', () => {
    const TestComponentWithBulkAction: FC = () => {
      const { countHeadCellRef, count } = useTableHeadCellCount<HTMLTableRowElement>()

      return (
        <Table>
          <thead>
            <tr>
              <Th>表頭1</Th>
              <Th>表頭2</Th>
              <Th>表頭3</Th>
            </tr>
            {/* BulkActionRow */}
            <tr ref={countHeadCellRef}>
              <td colSpan={count} data-testid="cell">
                カラム数: {count}
              </td>
            </tr>
          </thead>
        </Table>
      )
    }

    const { getByTestId } = render(<TestComponentWithBulkAction />)
    const cell = getByTestId('cell')

    // 1行目のcolSpanの合計をカウントする
    expect(cell).toHaveTextContent('カラム数: 3')
    expect(cell).toHaveAttribute('colspan', '3')
  })

  it('複数行のヘッダー + BulkActionRowの場合にカラム数を正しくカウントすること', () => {
    const TestComponent: FC = () => {
      const { countHeadCellRef, count } = useTableHeadCellCount<HTMLTableRowElement>()

      return (
        <Table>
          <thead>
            <tr>
              <Th rowSpan={2}>氏名</Th>
              <Th colSpan={2}>詳細情報</Th>
              <Th rowSpan={2}>アクション</Th>
            </tr>
            <tr>
              <Th>年齢</Th>
              <Th>部署</Th>
            </tr>
            {/* BulkActionRow */}
            <tr ref={countHeadCellRef}>
              <td colSpan={count} data-testid="cell">
                カラム数: {count}
              </td>
            </tr>
          </thead>
        </Table>
      )
    }

    const { getByTestId } = render(<TestComponent />)
    const cell = getByTestId('cell')

    // 1行目: 名前(colSpan=1) + 詳細情報(colSpan=2) + アクション(colSpan=1) = 4
    expect(cell).toHaveTextContent('カラム数: 4')
    expect(cell).toHaveAttribute('colspan', '4')
  })

  it('ヘッダーがない場合、カラム数が999であること', () => {
    const TestComponent: FC = () => {
      const { countHeadCellRef, count } = useTableHeadCellCount<HTMLTableSectionElement>()

      return (
        <Table>
          <tbody ref={countHeadCellRef}>
            <tr>
              <td data-testid="cell">カラム数: {count}</td>
            </tr>
          </tbody>
        </Table>
      )
    }

    const { getByTestId } = render(<TestComponent />)
    const cell = getByTestId('cell')

    expect(cell).toHaveTextContent('カラム数: 999')
  })
})
